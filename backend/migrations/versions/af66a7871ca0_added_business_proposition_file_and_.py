"""Added Business Proposition file and renamed tables

Revision ID: af66a7871ca0
Revises: 32c4fad2147f
Create Date: 2024-07-17 14:16:36.011776

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'af66a7871ca0'
down_revision: Union[str, None] = '32c4fad2147f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('business_proposition_files',
    sa.Column('id_business_proposition_file', sa.UUID(), nullable=False),
    sa.Column('file_name', sa.String(), nullable=False),
    sa.Column('format', sa.String(), nullable=False),
    sa.Column('confidential', sa.Boolean(), nullable=False),
    sa.Column('added_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('file', sa.LargeBinary(), nullable=False),
    sa.PrimaryKeyConstraint('id_business_proposition_file')
    )
    op.create_table('business_proposition_annotations',
    sa.Column('id_business_proposition_annotation', sa.UUID(), nullable=False),
    sa.Column('id_business_proposition_file', sa.UUID(), nullable=False),
    sa.Column('mission_name', sa.String(), nullable=True),
    sa.Column('client', sa.String(), nullable=True),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('end_date', sa.DateTime(), nullable=True),
    sa.Column('localisation_talan', sa.String(), nullable=True),
    sa.Column('localisation_client', sa.String(), nullable=True),
    sa.Column('number_of_workers', sa.Integer(), nullable=True),
    sa.Column('mission_length_in_month', sa.Integer(), nullable=True),
    sa.Column('number_of_in_person_meetings_per_week', sa.Integer(), nullable=True),
    sa.Column('transports', sa.ARRAY(postgresql.JSONB(astext_type=sa.Text())), nullable=True),
    sa.Column('number_of_emails_with_attachments_per_week', sa.Integer(), nullable=True),
    sa.Column('number_of_emails_without_attachments_per_week', sa.Integer(), nullable=True),
    sa.Column('hours_of_visioconference_per_week', sa.Integer(), nullable=True),
    sa.Column('camera_on', sa.Boolean(), nullable=True),
    sa.Column('computers', sa.ARRAY(postgresql.JSONB(astext_type=sa.Text())), nullable=True),
    sa.Column('phones', sa.ARRAY(postgresql.JSONB(astext_type=sa.Text())), nullable=True),
    sa.Column('storage_amount_in_terabytes', sa.Integer(), nullable=True),
    sa.Column('storage_length_in_month', sa.Integer(), nullable=True),
    sa.Column('number_of_backups', sa.Integer(), nullable=True),
    sa.Column('storage_provider', sa.String(), nullable=True),
    sa.Column('storage_location', sa.String(), nullable=True),
    sa.Column('compute_time', sa.Integer(), nullable=True),
    sa.Column('compute_provider', sa.String(), nullable=True),
    sa.Column('compute_location', sa.String(), nullable=True),
    sa.Column('compute_device', sa.String(), nullable=True),
    sa.Column('pages_printed_per_month', sa.Integer(), nullable=True),
    sa.Column('print_double_sided', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['id_business_proposition_file'], ['business_proposition_files.id_business_proposition_file'], ),
    sa.PrimaryKeyConstraint('id_business_proposition_annotation')
    )
    op.create_table('AnnotationAffectationTable',
    sa.Column('id_business_proposition_annotation', sa.UUID(), nullable=False),
    sa.Column('id_user', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['id_business_proposition_annotation'], ['business_proposition_annotations.id_business_proposition_annotation'], ),
    sa.ForeignKeyConstraint(['id_user'], ['users.id_users'], ),
    sa.PrimaryKeyConstraint('id_business_proposition_annotation', 'id_user')
    )
    op.drop_table('reviewers')
    op.drop_table('business_propositions')
    op.drop_table('user_business_propositions')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_business_propositions',
    sa.Column('id_business_proposition', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('id_user', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id_business_proposition', 'id_user', name='user_business_propositions_pkey')
    )
    op.create_table('business_propositions',
    sa.Column('id_business_proposition', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('mission_name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('client', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('start_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('end_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('localisation_talan', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('localisation_client', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('number_of_workers', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('mission_length_in_month', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('number_of_in_person_meetings_per_week', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('transports', postgresql.ARRAY(postgresql.JSONB(astext_type=sa.Text())), autoincrement=False, nullable=True),
    sa.Column('number_of_emails_with_attachments_per_week', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('number_of_emails_without_attachments_per_week', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('hours_of_visioconference_per_week', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('camera_on', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('computers', postgresql.ARRAY(postgresql.JSONB(astext_type=sa.Text())), autoincrement=False, nullable=True),
    sa.Column('phones', postgresql.ARRAY(postgresql.JSONB(astext_type=sa.Text())), autoincrement=False, nullable=True),
    sa.Column('storage_amount_in_terabytes', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('storage_length_in_month', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('number_of_backups', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('storage_provider', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('storage_location', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('compute_time', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('compute_provider', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('compute_location', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('compute_device', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('pages_printed_per_month', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('print_double_sided', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id_business_proposition', name='business_propositions_pkey')
    )
    op.create_table('reviewers',
    sa.Column('id_reviewer', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('id_user', sa.VARCHAR(), autoincrement=False, nullable=False)
    )
    op.drop_table('AnnotationAffectationTable')
    op.drop_table('business_proposition_annotations')
    op.drop_table('business_proposition_files')
    # ### end Alembic commands ###
