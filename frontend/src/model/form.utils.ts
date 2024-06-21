import { flatten } from "flat";
import { FormikErrors } from "formik";

/**
 * Fonction utilitaire pour construire les noms d'input en fonction du nom du parent
 * Utile pour les sous-champs ou les champs d'un tableau
 * => undefined + name => name
 * => mission + name => mission.name
 * => missions.0 + name => missions.0.name
 *
 * @param namespace nom du namespace parent
 * @param name nom du champ
 */
const buildName = <T>(namespace: string | undefined, name: keyof T): string =>
	namespace ? `${namespace}.${String(name)}` : String(name)

/**
 * Fonction permettant d'analyse les erreurs Formik et de scroller au premier champs en erreur
 * ("premier" est potentiellement faux, l'ordre n'est pas garanti)
 *
 * @param errors objet d'erreurs formik
 */
const scrollToFirstError = <T>(errors: FormikErrors<T>) => {
	// transform les erreurs nested de formik en objet plat
	// https://github.com/hughsk/flat/tree/v6.0.1
	const flattenErrors: Record<string, string> = flatten(errors)
	// on recherche le premier identifiant avec une erreur
	const firstEntryWithError = Object.entries(flattenErrors)
	                                  .find(([, v]) => v != undefined)
	if (firstEntryWithError) {
		// on cherche l'input correspondant et on le focus
		// /!\ sous-entend que les noms des inputs correspondent bien à la convention 'parentName.0.fieldName'
		const element = document.getElementsByName(firstEntryWithError[0]);
		if (element && element.length > 0) {
			element[0].focus();
		}
	}
}

export {
	buildName,
	scrollToFirstError
}
