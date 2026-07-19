let selectedFolder = null;


const systems = {

    "FC": [
        ".nes",
        ".fds"
    ],

    "SFC": [
        ".smc",
        ".sfc",
        ".fig"
    ],

    "GBA": [
        ".gba"
    ],

    "GB": [
        ".gb",
        ".gbc"
    ],

    "GBC": [
        ".gb",
        ".gbc"
    ],

    "MD": [
        ".gen",
        ".md",
        ".smd"
    ],

    "SMS": [
        ".sms",
        ".gg"
    ],

    "PS": [
        ".bin",
        ".cue",
        ".iso",
        ".img",
        ".pbp"
    ],

    "ARCADE": [
        ".zip",
        ".7z"
    ],

    "MAME": [
        ".zip",
        ".7z"
    ],

    "FBA": [
        ".zip",
        ".7z"
    ],

    "PCE": [
        ".pce"
    ],

    "NGPC": [
        ".ngp",
        ".npc"
    ],

    "WSC": [
        ".ws",
        ".wsc"
    ]

};



const selectButton = document.getElementById("selectFolder");
const startButton = document.getElementById("startGenerate");

const folderPath = document.getElementById("folderPath");
const progress = document.getElementById("progress");
const status = document.getElementById("status");



selectButton.onclick = async function(){

    try {

        selectedFolder =
        await window.showDirectoryPicker();


        folderPath.innerHTML =
        "Pasta selecionada: <b>"
        + selectedFolder.name
        + "</b>";


        startButton.disabled = false;


        status.innerHTML =
        "Pasta pronta para análise.";

    }

    catch(error){

        console.log(error);

    }

};





startButton.onclick = async function(){


    if(!selectedFolder){
        return;
    }


    startButton.disabled = true;
    selectButton.disabled = true;


    status.innerHTML =
    "Analisando sistema...";


    await generateFileLists();



    progress.style.width =
    "100%";


    status.innerHTML =
    "Processo concluído. FileLists atualizados.";


};





async function generateFileLists(){


    let total =
    Object.keys(systems).length;


    let current = 0;



    for(const system in systems){


        current++;


        updateProgress(
            current,
            total
        );



        try {


            const folder =
            await selectedFolder.getDirectoryHandle(
                system
            );


            await processSystemFolder(
                folder,
                systems[system]
            );


        }


        catch(error){

            // sistema não encontrado

        }


    }


}





async function processSystemFolder(folder, extensions){


    let games = [];



    for await(const entry of folder.values()){


        if(entry.kind !== "file"){
            continue;
        }



        let filename =
        entry.name;



        if(
            filename.toLowerCase()
            === "filelist.csv"
        ){
            continue;
        }



        let extension =
        getExtension(filename);



        if(
            extensions.includes(extension)
        ){

            games.push(filename);

        }


    }



    if(games.length > 0){

        await createFileList(
            folder,
            games
        );

    }


}





function getExtension(filename){


    let index =
    filename.lastIndexOf(".");


    if(index === -1){
        return "";
    }


    return filename
    .substring(index)
    .toLowerCase();


}





async function createFileList(folder, games){


    let content = "";



    games.forEach(game => {

        content += game + "\n";

    });



    const file =
    await folder.getFileHandle(
        "filelist.csv",
        {
            create:true
        }
    );



    const writable =
    await file.createWritable();



    await writable.write(content);


    await writable.close();


}





function updateProgress(current,total){


    let percent =
    (current / total) * 100;



    progress.style.width =
    percent + "%";


    status.innerHTML =
    "Analisando sistemas "
    + current
    + "/"
    + total;


}