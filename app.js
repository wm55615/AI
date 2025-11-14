const cleanDiv = document.getElementById("cleanMap");
function syncSize(){
  const rect = document.getElementById("map").getBoundingClientRect();
  cleanDiv.style.width = rect.width + "px";
  cleanDiv.style.height = rect.height + "px";
}
syncSize();
window.addEventListener("resize", syncSize);


const map = L.map('map', { zoomControl:false }).setView([52.237049, 21.017532], 13)
const cleanMap = L.map('cleanMap', { zoomControl:false, attributionControl:false }).setView([52.237049, 21.017532], 13)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '',
  crossOrigin: true
}).addTo(map)


L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '',
  crossOrigin: true
}).addTo(cleanMap)


map.on("move", syncCleanMap)
map.on("zoom", syncCleanMap)

function syncCleanMap(){
  const c = map.getCenter()
  cleanMap.setView(c, map.getZoom())
}

document.getElementById("zoom-in").onclick = ()=>map.zoomIn()
document.getElementById("zoom-out").onclick = ()=>map.zoomOut()

document.getElementById("loc-btn").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords
    L.marker([latitude,longitude]).addTo(map).bindPopup("Twoja lokalizacja").openPopup()
    map.setView([latitude, longitude], 16)
  })
}

document.getElementById("perm-btn").onclick = () => {
  if(Notification.permission!=="granted") Notification.requestPermission()
  navigator.geolocation.getCurrentPosition(()=>{},()=>{})
}

const piecesArea=document.getElementById("pieces-area")
const board=document.getElementById("board")
const snapshot=document.getElementById("snapshot")

for(let i=0;i<16;i++){
  const slot=document.createElement("div")
  slot.className="slot"
  slot.dataset.index=i
  slot.addEventListener("dragover",e=>e.preventDefault())
  slot.addEventListener("drop",onDrop)
  board.appendChild(slot)
}

let pieces=[]

document.getElementById("export-btn").onclick = async () => {
  const canvas = await html2canvas(cleanDiv, { useCORS:true })
  snapshot.src = canvas.toDataURL()
  document.getElementById("placeholder").style.display = "none"
  snapshot.style.display = "block"

  const w=canvas.width
  const h=canvas.height
  const pw=w/4
  const ph=h/4

  piecesArea.innerHTML=""
  pieces=[]

  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const temp=document.createElement("canvas")
      temp.width=pw
      temp.height=ph
      const ctx=temp.getContext("2d")
      ctx.drawImage(canvas,c*pw,r*ph,pw,ph,0,0,pw,ph)

      const img=new Image()
      img.src=temp.toDataURL()
      img.className="piece"
      img.draggable=true
      img.dataset.index=r*4+c
      img.dataset.size = pw * 1.0
      img.style.width = pw*0.7 + "px"
      img.style.height = "auto"

      img.addEventListener("dragstart",e=>{
        e.dataTransfer.setData("piece",img.dataset.index)
      })

      pieces.push(img)
    }
  }

  // Shuffle
  pieces.sort(()=>Math.random()-0.5)
  pieces.forEach(p=>piecesArea.appendChild(p))

  // nowa mapka → czyścimy planszę
  const slots = Array.from(board.children)
  slots.forEach(slot => slot.innerHTML = "")
}


function onDrop(e){
  e.preventDefault()
  const slot = e.currentTarget
  const index = e.dataTransfer.getData("piece")
  const piece = pieces.find(p => p.dataset.index===index)
  if(!piece) return

  const existing = slot.querySelector("img")
  if(existing){
    // przywracamy stary puzzle do puli
    const size = existing.dataset.size
    existing.style.width = size + "px"
    existing.style.height = "auto"
    piecesArea.appendChild(existing)
  }

  piece.style.width = "100%"
  piece.style.height = "auto"
  slot.appendChild(piece)

  checkCorrect()
}



function checkCorrect(){
  const slots=[...board.children]
  const ok=slots.every(slot=>{
    const piece=slot.querySelector("img")
    return piece && piece.dataset.index===slot.dataset.index
  })

  if(ok){
    setTimeout(() => {
      if(Notification.permission==="granted") new Notification("Puzzle ułożone!")
      else alert("Puzzle ułożone!")
    }, 1000) 
  }
}

piecesArea.addEventListener("dragover",e=>e.preventDefault())
piecesArea.addEventListener("drop", e=>{
  e.preventDefault()
  const index = e.dataTransfer.getData("piece")
  const piece = pieces.find(p => p.dataset.index === index)
  if(!piece) return

  // ustawiamy stały, oryginalny rozmiar puzzla
  const size = piece.dataset.size
  piece.style.width = size + "px"
  piece.style.height = "auto"

  piecesArea.appendChild(piece)
})

