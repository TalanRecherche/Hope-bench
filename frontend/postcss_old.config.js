import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    autoprefixer(), // Ajoute les préfixes automatiquement pour la compatibilité des navigateurs
    purgecss({
      content: [
        './src/**/*.html',        // pour les  fichiers HTML (par exemple dans public)
        './src/**/*.js',          // pour les fichiers JavaScript
        './src/**/*.jsx',         // pour les JSX
        './src/**/*.tsx',         // pour TypeScript avec React
        './src/**/*.scss',  
        './public/**/*.html',     // pour les fichiers HTML dans le dossier public
      ],
      safelist: {
        standard: [
          'active', 'btn', 'navbar', 'modal', 'dropdown', 'collapse', 'container', // Exemples de classes de Bootstrap à garder
          'btn-primary', 'btn-secondary', 'bg-light', 'text-center', 
        ],
      },
      //  'mode: report' permet de générer seulement un rapport sur le CSS inutilisé sans supprimer le CSS
      mode: 'report',
    }),
  ],
};
