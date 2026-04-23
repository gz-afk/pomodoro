let time = 1500;
let running = false;
let interval;
let isBreak = false;

let xp = Number(localStorage.getItem("xp")) || 0;
let sessions = Number(localStorage.getItem("sessions")) || 0;

let subject = "General";

function update(){
    let m = Math.floor(time/60);
    let s = time%60;
    document.getElementById("timer").innerText =
        `${m}:${s<10?"0":""}${s}`;
}

function log(msg){
    let t = document.getElementById("terminal");
    t.innerHTML += msg + "<br>";
    t.scrollTop = t.scrollHeight;
}

function updateStats(){
    document.getElementById("stats").innerHTML =
        `XP: ${xp}<br>Sessions: ${sessions}<br>Mode: ${isBreak?"Break":"Focus"}<br>Subject: ${subject}`;
}

function setSubject(s){
    subject = s;
    document.getElementById("subjectDisplay").innerText = "Subject: " + s;
    log("Subject: " + s);
}

function start(){
    if(running) return;
    running = true;
    log("Started");

    interval = setInterval(()=>{
        time--;
        update();

        if(time<=0){
            isBreak = !isBreak;
            time = isBreak ? 300 : 1500;

            if(!isBreak){
                xp++;
                sessions++;

                let today = new Date().toLocaleDateString();
                let data = JSON.parse(localStorage.getItem("data")) || {};

                if(!data[today]){
                    data[today] = { total:0, subjects:{} };
                }

                data[today].total++;
                data[today].subjects[subject] =
                    (data[today].subjects[subject]||0)+1;

                localStorage.setItem("data", JSON.stringify(data));
                localStorage.setItem("xp", xp);
                localStorage.setItem("sessions", sessions);
            }

            log(isBreak ? "Break Mode" : "Focus Mode");
            updateStats();
        }
    },1000);
}

function pause(){
    clearInterval(interval);
    running = false;
    log("Paused");
}

function reset(){
    pause();
    time = 1500;
    isBreak = false;
    update();
    log("Reset");
}

/* JARVIS */
function jarvis(cmd){
    cmd = cmd.toLowerCase();

    if(cmd.includes("status"))
        return `XP ${xp}, Sessions ${sessions}`;

    if(cmd.includes("start")){
        start();
        return "Session started";
    }

    if(cmd.includes("physics")){
        setSubject("Physics");
        return "Physics mode";
    }

    if(cmd.includes("chem")){
        setSubject("Chemistry");
        return "Chem mode";
    }

    if(cmd.includes("math")){
        setSubject("Math");
        return "Math mode";
    }

    return "Unknown command";
}

update();
updateStats();
log("JARVIS READY");