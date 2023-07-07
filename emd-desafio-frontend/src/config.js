var config = {
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    accessToken: 'pk.eyJ1IjoibHVjYXN0YXZhcmV4MiIsImEiOiJjbGprZXZ6bm4waDhpM2RvM2FsMGR3eHFqIn0.-_dpyqkDcZDiNfrmbxVF7Q',
    showMarkers: false,
    theme: 'light',
    alignment: 'left',
    title:'O Cristo Redentor',
    image:'assets/logo-prefeitura.png',
    chapters: [
        {
            id:'corcovado',
            title: '',
            location: {
                center: [-43.21048, -22.95181],
                zoom: 17.50,
                pitch: 75.00,
                bearing: -90
            },
            onChapterEnter: [
            ],
            onChapterExit: [
            ]
        },
        {
            id: 'cabeca',
            title: 'Curiosidades sobre a cabeça',
            image: 'assets/cabeca.jpg',
            description: `A cabeça do Cristo Redentor tem 3,75 metros de altura e é feita de concreto armado revestido com pedra-sabão, um tipo de rocha comum no Brasil.
            Dentro da cabeça, há uma escada em caracol com 12 degraus que leva ao interior da estátua, onde os visitantes podem encontrar um pequeno mirante.
            Do mirante na cabeça do Cristo Redentor, os visitantes têm uma vista panorâmica espetacular da cidade do Rio de Janeiro, incluindo a Baía de Guanabara, a Floresta da Tijuca e as praias de Copacabana e Ipanema.
            `,
            location: {
                center: [-43.21075, -22.95181],
                zoom: 19.80,
                pitch: 55,
                bearing: -90
            },
            onChapterEnter: [
            ],
            onChapterExit: [
            ]
        },
        {
            id: 'bracos',
            title: 'Curiosidades sobre os braços',
            image: 'assets/bracos.jpg',
            description: `Os braços do Cristo Redentor têm uma envergadura impressionante de 28 metros cada, criando uma sensação de abraço simbólico sobre a cidade.
            Os braços da estátua foram projetados para representar a mensagem de acolhimento e proteção do Cristo Redentor, simbolizando o amor e a paz que ele oferece ao Rio de Janeiro e ao mundo.
            Os braços do Cristo Redentor foram construídos separadamente e fixados ao corpo da estátua durante a montagem.`,
            location: {
                center: [-43.21065, -22.95190],
                zoom: 19.50,
                pitch: 62.00,
                bearing: -99
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'tronco',
            title: 'Curiosidades sobre o tronco',
            image: 'assets/tronco.jpg',
            description: `O tronco do Cristo Redentor tem 30 metros de altura e é constituído por uma estrutura de concreto armado revestida com placas de pedra-sabão.
            Dentro do tronco, há um elevador que leva os visitantes à plataforma de observação no peito da estátua, a cerca de 38 metros de altura.
            O tronco do Cristo Redentor também abriga uma capela chamada Capela de Nossa Senhora Aparecida, onde missas e cerimônias religiosas são realizadas periodicamente.`,
            location: {
                center: [-43.21048, -22.95181],
                zoom: 20.00,
                pitch: 70.00,
                bearing: -95
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'pernas',
            title: 'Curiosidades sobre as pernas',
            image: 'assets/pernas.jpg',
            description: `As pernas do Cristo Redentor são compostas por uma estrutura de concreto armado coberta com placas de pedra-sabão, assim como o tronco.
            A altura das pernas é de aproximadamente 11 metros, e cada pé tem cerca de 1,35 metros de comprimento.
            O design das pernas do Cristo Redentor é emblemático, transmitindo a sensação de solidez e firmeza da estátua, como se estivesse enraizada na montanha do Corcovado.`,
            location: {
                center: [-43.21048, -22.95181],
                zoom: 21.00,
                pitch: 70.00,
                bearing: -90
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};

export default config;