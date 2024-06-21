import re
from zipfile import ZipFile

from jinja2 import Environment
from jinja2.exceptions import TemplateError

"""
GROS COPIER COLLER de la lib docxtpl. avec remplacement des namespace word par ppt (<w:t> => <a:t>, etc...)
Elle est capable de faire un gros ménage sur les tag xml, te de faire le rendering au niveau 
"""


class PptxTemplateGenerator:
    def __init__(self, input_path, context):
        self.input_path = input_path
        self.context = context
        self.jinja_env = Environment(autoescape=True)


    def process(self, output_path):
        with ZipFile(self.input_path, 'r') as zip_in:
            with ZipFile(output_path, 'w') as zip_tmp:
                for file in zip_in.namelist():
                    content = zip_in.read(file)
                    if file.startswith('ppt/slides/') and not file.startswith('ppt/slides/_rels'):
                        content = self.patch_slide(content.decode())
                    zip_tmp.writestr(file, content)

    def patch_slide(self, str_xml):
        xml = self.patch_xml(str_xml)
        xml = self.render_xml_part(xml, self.context, self.jinja_env)
        return xml

    def patch_xml(self, src_xml):
        """ Make a lots of cleaning to have a raw xml understandable by jinja2 :
        strip all unnecessary xml tags, manage table cell background color and colspan,
        unescape html entities, etc... """

        # replace {<something>{ by {{   ( works with {{ }} {% and %} {# and #})
        src_xml = re.sub(r'(?<={)(<[^>]*>)+(?=[\{%\#])|(?<=[%\}\#])(<[^>]*>)+(?=\})', '',
                         src_xml, flags=re.DOTALL)

        # replace {{<some tags>jinja2 stuff<some other tags>}} by {{jinja2 stuff}}
        # same thing with {% ... %} and {# #}
        # "jinja2 stuff" could a variable, a 'if' etc... anything jinja2 will understand
        def striptags(m):
            return re.sub('</a:t>.*?(<a:t>|<a:t [^>]*>)', '',
                          m.group(0), flags=re.DOTALL)

        src_xml = re.sub(r'{%(?:(?!%}).)*|{#(?:(?!#}).)*|{{(?:(?!}}).)*', striptags,
                         src_xml, flags=re.DOTALL)

        # manage table cell colspan
        def colspan(m):
            cell_xml = m.group(1) + m.group(3)
            cell_xml = re.sub(r'<a:r[ >](?:(?!<a:r[ >]).)*<a:t></a:t>.*?</a:r>',
                              '', cell_xml, flags=re.DOTALL)
            cell_xml = re.sub(r'<a:gridSpan[^/]*/>', '', cell_xml, count=1)
            return re.sub(r'(<a:tcPr[^>]*>)', r'\1<a:gridSpan a:val="{{%s}}"/>'
                          % m.group(2), cell_xml)

        src_xml = re.sub(r'(<a:tc[ >](?:(?!<a:tc[ >]).)*){%\s*colspan\s+([^%]*)\s*%}(.*?</a:tc>)',
                         colspan, src_xml, flags=re.DOTALL)

        # manage table cell background color
        def cellbg(m):
            cell_xml = m.group(1) + m.group(3)
            cell_xml = re.sub(r'<a:r[ >](?:(?!<a:r[ >]).)*<a:t></a:t>.*?</a:r>',
                              '', cell_xml, flags=re.DOTALL)
            cell_xml = re.sub(r'<a:shd[^/]*/>', '', cell_xml, count=1)
            return re.sub(r'(<a:tcPr[^>]*>)',
                          r'\1<a:shd a:val="clear" a:color="auto" a:fill="{{%s}}"/>'
                          % m.group(2), cell_xml)

        src_xml = re.sub(r'(<a:tc[ >](?:(?!<a:tc[ >]).)*){%\s*cellbg\s+([^%]*)\s*%}(.*?</a:tc>)',
                         cellbg, src_xml, flags=re.DOTALL)

        # ensure space preservation
        src_xml = re.sub(r'<a:t>((?:(?!<a:t>).)*)({{.*?}}|{%.*?%})',
                         r'<a:t xml:space="preserve">\1\2',
                         src_xml, flags=re.DOTALL)
        src_xml = re.sub(r'({{r\s.*?}}|{%r\s.*?%})',
                         r'</a:t></a:r><a:r><a:t xml:space="preserve">\1</a:t></a:r><a:r><a:t xml:space="preserve">',
                         src_xml, flags=re.DOTALL)

        # {%- will merge with previous paragraph text
        src_xml = re.sub(r'</a:t>(?:(?!</a:t>).)*?{%-', '{%', src_xml, flags=re.DOTALL)
        # -%} will merge with next paragraph text
        src_xml = re.sub(r'-%}(?:(?!<a:t[ >]|{%|{{).)*?<a:t[^>]*?>', '%}', src_xml, flags=re.DOTALL)

        for y in ['tr', 'tc', 'p', 'r']:
            # replace into xml code the row/paragraph/run containing
            # {%y xxx %} or {{y xxx}} template tag
            # by {% xxx %} or {{ xx }} without any surrounding <a:y> tags :
            # This is mandatory to have jinja2 generating correct xml code
            pat = r'<a:%(y)s[ >](?:(?!<a:%(y)s[ >]).)*({%%|{{)%(y)s ([^}%%]*(?:%%}|}})).*?</a:%(y)s>' % {'y': y}
            src_xml = re.sub(pat, r'\1 \2', src_xml, flags=re.DOTALL)

        for y in ['tr', 'tc', 'p']:
            # same thing, but for {#y xxx #} (but not where y == 'r', since that
            # makes less sense to use comments in that context
            pat = r'<a:%(y)s[ >](?:(?!<a:%(y)s[ >]).)*({#)%(y)s ([^}#]*(?:#})).*?</a:%(y)s>' % {'y': y}
            src_xml = re.sub(pat, r'\1 \2', src_xml, flags=re.DOTALL)

        # add vMerge
        # use {% vm %} to make this table cell and its copies be vertically merged within a {% for %}
        def v_merge_tc(m):
            def v_merge(m1):
                return (
                        '<a:vMerge a:val="{% if loop.first %}restart{% else %}continue{% endif %}"/>' +
                        m1.group(1) +  # Everything between ``</a:tcPr>`` and ``<a:t>``.
                        "{% if loop.first %}" +
                        m1.group(2) +  # Everything before ``{% vm %}``.
                        m1.group(3) +  # Everything after ``{% vm %}``.
                        "{% endif %}" +
                        m1.group(4)  # ``</a:t>``.
                )

            return re.sub(
                r'(</a:tcPr[ >].*?<a:t(?:.*?)>)(.*?)(?:{%\s*vm\s*%})(.*?)(</a:t>)',
                v_merge,
                m.group(),  # Everything between ``</a:tc>`` and ``</a:tc>`` with ``{% vm %}`` inside.
                flags=re.DOTALL,
            )

        src_xml = re.sub(r'<a:tc[ >](?:(?!<a:tc[ >]).)*?{%\s*vm\s*%}.*?</a:tc[ >]',
                         v_merge_tc, src_xml, flags=re.DOTALL)

        # Use ``{% hm %}`` to make table cell become horizontally merged within
        # a ``{% for %}``.
        def h_merge_tc(m):
            xml_to_patch = m.group()  # Everything between ``</a:tc>`` and ``</a:tc>`` with ``{% hm %}`` inside.

            def with_gridspan(m1):
                return (
                        m1.group(1) +  # ``a:gridSpan a:val="``.
                        '{{ ' + m1.group(2) + ' * loop.length }}' +  # Content of ``a:val``, multiplied by loop length.
                        m1.group(3)  # Closing quotation mark.
                )

            def without_gridspan(m2):
                return (
                        '<a:gridSpan a:val="{{ loop.length }}"/>' +
                        m2.group(1) +  # Everything between ``</a:tcPr>`` and ``<a:t>``.
                        m2.group(2) +  # Everything before ``{% hm %}``.
                        m2.group(3) +  # Everything after ``{% hm %}``.
                        m2.group(4)  # ``</a:t>``.
                )

            if re.search(r'a:gridSpan', xml_to_patch):
                # Simple case, there's already ``gridSpan``, multiply its value.

                xml = re.sub(
                    r'(a:gridSpan a:val=")(\d+)(")',
                    with_gridspan,
                    xml_to_patch,
                    flags=re.DOTALL,
                )
                xml = re.sub(
                    r'{%\s*hm\s*%}',
                    '',
                    xml,  # Patched xml.
                    flags=re.DOTALL,
                )
            else:
                # There're no ``gridSpan``, add one.
                xml = re.sub(
                    r'(</a:tcPr[ >].*?<a:t(?:.*?)>)(.*?)(?:{%\s*hm\s*%})(.*?)(</a:t>)',
                    without_gridspan,
                    xml_to_patch,
                    flags=re.DOTALL,
                )

            # Discard every other cell generated in loop.
            return "{% if loop.first %}" + xml + "{% endif %}"

        src_xml = re.sub(r'<a:tc[ >](?:(?!<a:tc[ >]).)*?{%\s*hm\s*%}.*?</a:tc[ >]',
                         h_merge_tc, src_xml, flags=re.DOTALL)

        def clean_tags(m):
            return (m.group(0)
                    .replace(r"&#8216;", "'")
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace(u'“', u'"')
                    .replace(u'”', u'"')
                    .replace(u"‘", u"'")
                    .replace(u"’", u"'"))

        src_xml = re.sub(r'(?<=\{[\{%])(.*?)(?=[\}%]})', clean_tags, src_xml)

        return src_xml

    def render_xml_part(self, src_xml, context, jinja_env):
        src_xml = re.sub(r'<a:p([ >])', r'\n<a:p\1', src_xml)
        try:
            template = jinja_env.from_string(src_xml)
            dst_xml = template.render(context)
        except TemplateError as exc:
            if hasattr(exc, 'lineno') and exc.lineno is not None:
                line_number = max(exc.lineno - 4, 0)
                exc.docx_context = map(lambda x: re.sub(r'<[^>]+>', '', x),
                                       src_xml.splitlines()[line_number:(line_number + 7)])
            raise exc
        dst_xml = re.sub(r'\n<a:p([ >])', r'<a:p\1', dst_xml)
        dst_xml = (dst_xml
                   .replace('{_{', '{{')
                   .replace('}_}', '}}')
                   .replace('{_%', '{%')
                   .replace('%_}', '%}'))
        dst_xml = self.resolve_listing(dst_xml)
        return dst_xml

    def resolve_listing(self, xml):

        def resolve_text(run_properties, paragraph_properties, m):
            xml = m.group(0).replace('\t', '</a:t></a:r>'
                                           '<a:r>%s<a:tab/></a:r>'
                                           '<a:r>%s<a:t xml:space="preserve">' % (run_properties, run_properties))
            xml = xml.replace('\a', '</a:t></a:r></a:p>'
                                    '<a:p>%s<a:r>%s<a:t xml:space="preserve">' % (paragraph_properties, run_properties))
            xml = xml.replace('\n', '</a:t><a:br/><a:t xml:space="preserve">')
            xml = xml.replace('\f', '</a:t></a:r></a:p>'
                                    '<a:p><a:r><a:br a:type="page"/></a:r></a:p>'
                                    '<a:p>%s<a:r>%s<a:t xml:space="preserve">' % (paragraph_properties, run_properties))
            return xml

        def resolve_run(paragraph_properties, m):
            run_properties = re.search(r'<a:rPr>.*?</a:rPr>', m.group(0))
            run_properties = run_properties.group(0) if run_properties else ''
            return re.sub(r'<a:t(?: [^>]*)?>.*?</a:t>',
                          lambda x: resolve_text(run_properties, paragraph_properties, x), m.group(0),
                          flags=re.DOTALL)

        def resolve_paragraph(m):
            paragraph_properties = re.search(r'<a:pPr>.*?</a:pPr>', m.group(0))
            paragraph_properties = paragraph_properties.group(0) if paragraph_properties else ''
            return re.sub(r'<a:r(?: [^>]*)?>.*?</a:r>',
                          lambda x: resolve_run(paragraph_properties, x),
                          m.group(0), flags=re.DOTALL)

        xml = re.sub(r'<a:p(?: [^>]*)?>.*?</a:p>', resolve_paragraph, xml, flags=re.DOTALL)

        return xml
