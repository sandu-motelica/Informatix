const tags = document.getElementsByClassName('tag');

const searchTag = (event)=> {
    Array.from(tags).forEach(item => {
        if(event.target.value==='') item.style.display = 'flex';
        else if(item.getAttribute('data-name').toLowerCase().includes(event.target.value.toLowerCase())) {
            item.style.display = 'flex';
        }
        else item.style.display = 'none';
    });
}