
let missiles =[];
let missileIran=[];

const interceptSound = new Audio(`sounds/axiom-boom-3aif-14517.mp3`);
const failSound = new Audio(`sounds/cinematic-boom-171285.mp3`);
const alarm = new Audio(`sounds/depositphotos_539316180-track-awesome-walkie-talkie-sound-effects.mp3`);


const playSound = (message) => {
    const list = message.split(' ');
    if (list.includes("faild")) {
        failSound.play(); 
    } 

    else {
        interceptSound.play();
    }
};
const playSoundalarm = () => {
    alarm.play();
};



const loadMissileJson = () => {
    let fileName;

    
        fileName = '/json1.json';

    fetch(fileName)
        .then(response => response.json())
        .then(result => {
            console.log(`Loaded missiles: ${JSON.stringify(result)}`);

          
                missiles = result; 
                  
                
});
      
        
};


const managerfunction


//  document.getElementById('allmissile').addEventListener('click', () => loadMissileJson('allmissile'));


const socket = new WebSocket('ws://localhost:3108/MissileHandler');


const publish =  () =>{
while(missiles.shift())
{
    const newMissile = missiles.shift();
    // socket.send(JSON.stringify(newMissile));
    console.log('Sent missile:', newMissile);
    const misDiv = document.getElementById("mis-div");
    const p1 = document.createElement("p");
     p1.innerText =  `Sent missile: ${JSON.stringify(newMissile)}`;
    
      misDiv.appendChild(p1); 
}

}


let activeMissiles = {};

const sendPublish = () => {
    // console.log(missiles.shift())
    const newMissile = missiles.shift();
    
    if (newMissile) {
        socket.send(JSON.stringify(newMissile));
        console.log('Sent missile:', newMissile);

      
        const misDiv = document.getElementById("mis-div");
        const p1 = document.createElement("p");
        p1.innerText = `Sent missile: ${JSON.stringify(newMissile)}`;
        misDiv.appendChild(p1);

       
        const misDiv2 = document.getElementById("missiles-div");
        const missileElement = document.createElement("div");
        missileElement.classList.add("missile-item");
        missileElement.id = newMissile.id; 

  
        const redLight = document.createElement("div");
        redLight.classList.add("red-light");
        missileElement.appendChild(redLight);

        const missileText = document.createElement("p");
        missileText.innerText = `Missile in the air: ${JSON.stringify(newMissile)}`;
        missileElement.appendChild(missileText);
        playSoundalarm();

        const timer = document.createElement("span");
        timer.classList.add("missile-timer");
        missileElement.appendChild(timer);
        misDiv2.appendChild(missileElement);

        const missileTime = newMissile.Time || 5;
        setTimeout(() => {
            if (document.getElementById(newMissile.id)) {
              
                const explosion = document.createElement("div");
                explosion.classList.add("explosion");
                missileElement.appendChild(explosion);

                setTimeout(() => missileElement.remove(), 2000); 
            }
        }, missileTime * 1000);

       
        activeMissiles[newMissile.id] = { element: missileElement };
    }
};







socket.onmessage = (event) => {
    const message = event.data;
    
    
    const list = message.split(' ');

   
    if (list.includes("faild")) {
        const resultsDiv = document.getElementById("failed-intercepts-div");
        const p = document.createElement("p");
        p.innerText = message; 
        resultsDiv.appendChild(p);
        playSound(message)
        console.log('Received message:', message);
    } else {
        const resultsDiv = document.getElementById("intercepted-missiles-div");
        const p = document.createElement("p");
        p.innerText = message; 
        resultsDiv.appendChild(p);
        playSound(message)
        console.log('Received message:', message);
        
    }
    
};



socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};


socket.onclose = (event) => {
    console.log('WebSocket closed:', event);
};

loadMissileJson()
// publish()

// for(let i = 0 ; i<missiles.length ; i++)
// {

//     await new Promise(missiles[i].Time); 
//     sendPublish()

// }
