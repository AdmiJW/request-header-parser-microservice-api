

//==================================
//  Intersection Observer
//==================================
const options = {
    threshold: 0.35
};

const navbar = document.querySelector('nav');

const jumbotronObserver = new IntersectionObserver( (entries, SELF)=> {
    const { isIntersecting } = entries[0];
    
    if (isIntersecting)
        navbar.classList.remove('bg_visible');
    else
        navbar.classList.add('bg_visible');

}, options);

jumbotronObserver.observe( document.querySelector('.jumbotron') );



//=====================================
//  Text Typer Effect
//=====================================

const tt = new TextTyper( document.querySelector('#jumbotron__text > h1'), {
    typeCPS: 10,
    deleteCPS: 5
});

tt.eventQueue()
    .typeText("Who are you?")
    .standby(2000)
    .deleteChar()
    .typeText("Who Am I?")
    .standby(5000)
    .deleteChar()
    .loop()
    .start();