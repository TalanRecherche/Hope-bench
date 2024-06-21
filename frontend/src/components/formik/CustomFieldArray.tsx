import {FieldArray} from "formik";
import {ArrayHelpers} from "formik/dist/FieldArray";
import {ReactNode} from "react";
import {Button, Stack} from "react-bootstrap";
import FieldArrayError from "./FieldArrayError";
import InlineForm from "../InlineForm";

interface Props<T> {
    name: string
    values: T[] | undefined
    render: (props: RenderProps) => ReactNode
    newValueBuilder: () => T
    withLabels?: boolean
}

interface RenderProps {
    name: string,
    index: number,
    arrayHelpers: ArrayHelpers
}

/**
 * Composant pour faciliter l'utilisation d'input multiple s'intégrant avec Formik
 * Le composant prend en charge
 *  - affichage des boutons de suppression et d'ajout
 *  - affichage de l'erreur potentielle sur la liste (et non des enfants)
 *
 * @param name nom de l'input
 * @param values liste des valeurs de l'input
 * @param render fonction d'affichage d'un element de la liste
 * @param newValueBuilder fonction pour construire un nouvel element de la liste
 */
const CustomFieldArray = <T, >({name, values, render, newValueBuilder, withLabels}: Props<T>) => (
    <FieldArray
        name={name}
        render={arrayHelpers => (<Stack gap={3}>
            {(values || []).map((_, index) => (
                <InlineForm key={index}
                            withLabels={withLabels != undefined ? withLabels : (index === 0)}
                            onRemove={() => arrayHelpers.remove(index)}>
                    {render({
                        name: `${name}.${index}`, index, arrayHelpers
                    })}
                </InlineForm>
            ))}
            <FieldArrayError name={name}/>
            <div>
                <Button size="sm" variant="secondary"
                        onClick={() => arrayHelpers.push(newValueBuilder())}
                ><i className="bi bi-plus-lg"></i></Button>
            </div>
        </Stack>)}
    />
)
export default CustomFieldArray
