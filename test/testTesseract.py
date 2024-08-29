from PIL import Image
import pytesseract
from pdf2image import convert_from_path

# Chemin vers le PDF à analyser
pdf_path = 'test/examples/variationDeplacement/3-Coût déplacement faible/Talan Consulting - SNCF Transilien - Accompagnement PMO EOLE EPT4_v1.pdf'

# Convertir les pages du PDF en images
pages = convert_from_path(pdf_path)

# Initialiser une variable pour stocker le texte extrait
extracted_text = ""

# Utiliser Tesseract pour extraire le texte de chaque page
for page in pages:
	text = pytesseract.image_to_string(page, lang='fra')  # Spécifiez la langue si nécessaire
	extracted_text += text + "\n"

# Afficher le texte extrait
print("Texte extrait du PDF :")
print(extracted_text)

# Sauvegarder le texte extrait dans un fichier
with open('texte_extrait.txt', 'w', encoding='utf-8') as f:
	f.write(extracted_text)

