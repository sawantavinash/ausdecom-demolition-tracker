const HOLIDAYS = new Set([
"2026-04-18","2026-04-19","2026-04-25","2026-04-26","2026-04-27",
"2026-05-02","2026-05-03","2026-05-09","2026-05-10","2026-05-16","2026-05-17","2026-05-23","2026-05-24","2026-05-30","2026-05-31",
"2026-06-06","2026-06-07","2026-06-08","2026-06-13","2026-06-14","2026-06-20","2026-06-21","2026-06-27","2026-06-28"
]);

function workDays(start,end,now){
let d = new Date(Math.max(start,now)), count=0;
while(d<=end){
const iso=d.toISOString().split("T")[0];
if(d.getDay()!=0 && d.getDay()!=6 && !HOLIDAYS.has(iso)) count++;
d.setDate(d.getDate()+1);
}
return count;
}

function render(){
const today=document.getElementById("checkDate").valueAsDate;
let zonesActive=0, asb=0, demo=0;
let html="";

ZONES.forEach(z=>{
let active=false;
let scopeHTML="";

z.scopes.forEach(s=>{
const st=new Date(s.start);
const en=new Date(s.end);

if(today>=st && today<=en){
active=true;
const left=workDays(st,en,today);
if(s.type==="asbestos") asb++;
if(s.type==="demolition") demo++;

scopeHTML+=`
<div class="scope ${s.type}">
<strong>${s.label}</strong>
<div class="days ${left<=10?'critical':''}">${left} days left</div>
<div class="progress">
<div class="fill" style="width:${100-(left/workDays(st,en,st)*100)}%;
background:${s.type==="asbestos"?"#fd7e14":"var(--lime)"}"></div>
</div>
</div>`;
}
});

if(active){
zonesActive++;
html+=`
<section class="zone">
<div>
<h2>${z.name}</h2>
<span class="badge">${asb>0?"ASBESTOS / ":""}${demo>0?"DEMOLITION":""}</span>
</div>
<div>${scopeHTML}</div>
</section>`;
}
});

document.getElementById("zoneContainer").innerHTML=html;
document.getElementById("zonesActive").innerText=zonesActive;
document.getElementById("asbActive").innerText=asb;
document.getElementById("demoActive").innerText=demo;
}

function downloadPDF(){
html2pdf().from(document.getElementById("app"))
.save("Ausdecom_Demolition_Tracker.pdf");
}

document.getElementById("checkDate").valueAsDate=new Date();
render();
