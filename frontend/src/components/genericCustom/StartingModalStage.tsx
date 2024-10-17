interface Props {
    formStage: number;
}

function StartingModalStage({ formStage }: Props) {
    switch (formStage) {
        case 0:
            return <StartingModalStage1 />;
        case 1:
            return <StartingModalStage2 />;
        case 2:
            return <StartingModalStage3 />;
        default:
            return <></>;
    };
} export default StartingModalStage;

// UPDATE THE CONTENTS OF THE FORM HERE
function StartingModalStage1() {
    return (
        <>
            <p>Nous travaillons actuellement sur une application d'IA générative qui permettra aux équipes commerciales
                de bénéficier de données d'émission de C02 sur les missions que nous menons.</p>

            <div>Ceci sert les enjeux de :
                <ul style={{ listStyle: 'inside' }}>
                    <li> préservation de l'environnement</li>
                    <li>performance des réponses aux appels d’offres que nous formulons à nos clients..</li>
                </ul>
            </div>
        </>
    );
}

function StartingModalStage2() {
    return (
        <>
            <p> Dans ce contexte, nous avons besoin de toi pour "labeliser" les données issues des propositions commerciales.</p>

            <p style={{ fontWeight: 700 }} > Ta mission est de nous apporter les informations liées au calcul de CO2 de nos missions que tu trouveras dans les
                documents et/ou que tu déduiras de tes connaissances.</p>

            <p style={{ fontWeight: 700 }}> Mais aussi de renseigner tes sources de récoltes d'information en remplissant la partie "labelisation" des tuiles
                en dessous de chaque question.</p>
        </>
    );
}

function StartingModalStage3() {
    return (
        <>
            <p> Afin de bien servir notre projet, nous souhaitons que tu renseignes un maximum d'informations même si celles-ci ne
                sont issues que de tes déductions. </p>

            <p> L’ordre dans lequel tu remplis ce questionnaire n’est pas établi. Il dépend avant tout de la façon que tu considères
                comme la plus productive.</p>
        </>
    );
}