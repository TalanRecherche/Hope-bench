/**
 * Fonction pour convertir un "blob" en un fichier téléchargé par le navigateur
 */
import { AxiosResponse } from "axios";

const downloadBlob = (blob: Blob, fileName: string): void => {
	const aElement = document.createElement("a");
	aElement.setAttribute("download", fileName);
	const href = URL.createObjectURL(blob);
	aElement.href = href;
	aElement.setAttribute("target", "_blank");
	aElement.click();
	URL.revokeObjectURL(href);
};

/**
 * Fonction qui extrait le nom du fichier défini par le serveur dans l'entête standard
 * Si non défini, renvoie la valeur par défaut
 */
const extractFileNameFromResponse = (res: AxiosResponse, defaultValue: string): string => {
	const header = res.headers["content-disposition"]
	const parts = header!.split(';');
	const fileName = parts[1].split('=')[1];
	return fileName || defaultValue;
};

/**
 * Fonction pour télécharger un fichier contenu dans une réponse Http
 * Le nom du fichier est extrait de la réponse si présent
 *
 * @param res réponse
 * @param defaultFileName nom du fichier par défaut
 */
const downloadFileFromResponse = async (res: AxiosResponse, defaultFileName: string): Promise<void> => {
	const fileName = extractFileNameFromResponse(res, defaultFileName);
	downloadBlob(res.data, fileName);
};

export {
	extractFileNameFromResponse,
	downloadFileFromResponse,
	downloadBlob
}
