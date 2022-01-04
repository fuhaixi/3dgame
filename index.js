
const cards_list = document.querySelector('.cards_list')
let cards=[]
for (let index = 0; index < 5; index++) {
    let card=document.createElement('div')
    card.className='model_card'
    card.addEventListener('click',(e)=>{window.location.href='model_scene.html'})
    // card.setAttribute('href',"index copy.html")
    card.innerText="model "+index
    cards.push(card)
    cards_list.appendChild(card)
    
}

