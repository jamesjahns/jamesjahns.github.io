const charA = {
    src: "chars/A.png",
    adj: [
        "educational","revolutionary","four-dimensional","unequivocal","configurable","rheumatoid","delusional","gregarious","tenacious","communicative","unintentional","eukaryotic","precolumbian","ecuadorian","encouraging","communicative","gubernatorial","intravenous","unintentional","unauthorised","belorussian","undemocratic","mustachioed","semi-opaque","eukaryotic","unsociable","facetious","disfavoured","europeanised","gelatinous"
    ],
    noun: [
        "tambourine","crematorium","educationist","cauliflower","auctioneer","deinosaur","utopianizer","denunciator","europeanist","boatbuilder","plesiosaur","mountaineer","oceanarium","quaternion","autotheist","tambourine","housemaid","pandemonium"
    ]
}

const charB = {
    src: "chars/B.png",
    adj: [
        "stressed","repaid","reviled","lived","regal","straw","drab","smug","live","evil","snug","delian","slipup","debut","smart","tressed","eviler"
    ],
    noun: [
        "drawer","desserts","lamina","animal","diaper","devil","lager","parts","bard","wolf","trap","tool","loot","looter","reward","Kramer"
    ]
}

const charC = {
    src: "chars/C.png",
    adj: [
        "semantic","manifold","emanating","commanding","demanding","manageable","mildmannered","dismantled","romantic","mandatory","permanent","humanist","Roman ","mangled","permanent","mismanaged","manufactured","dormant"
    ],
    noun: [
        "egomaniac","salamander","commander","mango","maniac","mantissa","talisman ","almanac","claimant","manuscript","necromancer","mantelpiece","nymphomaniac","germanium","manager","chairwoman","Mandarin","yeoman","mantra","gentleman"
    ]
}

const charD = {
    src: "chars/D.png",
    adj: [
        "peabrained","abrasive","Tobagonian","signature","somewhat","baronial","tangible","eligible","fungible","weedless","gloomy","unowned","gulping","serioludicrous","microtomic","protomorphic","endurant","cloddish"
    ],
    noun: [
        "labrador","timewaster","Bartholomew","crimewriter","macaroni","Sharon","parasite","parasailer","parasol","cherubim"
    ]
}

const charE = {
    src: "chars/E.png",
    adj: [
        "cabbaged","dead","gaffed","effaced","beefed","egged","bagged","ebbed","edged","acceded","bad","deaf","added","cadged","faced","faded","gagged","beaded"
    ],
    noun: [
        "cage","ace","facade","egg","babe","bee","adage","badge","cafe","bead","bed","cab"
    ]
}

const charF = {
    src: "chars/F.png",
    adj: [
        "helpless","useless","monotone","childlike","debatable","undivided","individual","hesitating","gravitating","proportional","breathtaking","exploitative","hypothesised","misenterpreted","incapacitated","regurgitating","institutionalized","unconstitutional"
    ],
    noun: [
        "wildlife","basilisk","interpreter","physicist","brewery","synonym","tenement","storeroom","pessimist","subdivider","limitation","obtuseness","hostility","aromaticity"
    ]
}

const charG = {
    src: "chars/G.png",
    adj: [
        "reviving","mining","dining","imbibing","feminine","sustaining","convivial","partitioned","throwaway","remembering","uninitiated","competitive","repetitive","homomorphic","superstitious","asinine","fantasising","unparalleled","catatonic","interstitial"
    ],
    noun: [
        "cantata","gatherer","murderer","phototype","scatterer","sorcerer","hepatitis","petition","entities","queue","quantities","prerequisite","prototype","rhododendron","hippopotamus","philologist","partition","wanderer"
    ]
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function rollNewChar(imgs)
{
    const roll = Math.random();
    let amount = 4;
    if(roll<0.7) {
        amount = 6;
    }
    else if(roll<0.9) {
        amount = 5;
    }

    const bag = bagOfChars();
    const adjs = getAdjectives(amount-1,bag,imgs);
    const noun = getNoun(bag,imgs);

    shuffle(imgs);
    return adjs.join(' ') + ' ' + noun;
}

function bagOfChars()
{
    return [ charA, charB, charC, charD, charE, charF, charG];
}

function pullFromBag(arr)
{
    const index= Math.floor(Math.random() * arr.length);
    const toReturn = arr[index];
    arr.splice(index,1);
    return toReturn;
    
}

function getAdjectives(amount,bag,imgs)
{
    const adjs = [];
    for(let i=0;i<amount;i++)
    {
        const choice = pullFromBag(bag);
        imgs.push(choice.src);
        const adjIndex = Math.floor(Math.random() * choice.adj.length);
        adjs.push( choice.adj[adjIndex] );
    }
    return adjs.sort();
}

function getNoun(bag,imgs)
{
    const choice = pullFromBag(bag);
    imgs.push(choice.src);
    const nounIndex = Math.floor(Math.random() * choice.noun.length);
    return ( choice.noun[nounIndex] );
}