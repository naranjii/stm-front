import interact from 'interactjs'
interact('#draggable')
    .draggable({
      autoScroll: true,
      listeners: {
        down (event) {
        // ESSENCIAL: Impede que o evento de clique "suba" para o Painel
        event.stopPropagation();
      },
      // Este evento 'dragstart' também é importante para garantir
      // que o drag do pai não seja iniciado pelo filho
      start (event) {
        // ESSENCIAL: Impede o comportamento padrão de arrastar do pai
        event.preventDefault();
        console.log('Drag do Container iniciado!', event.target);
      },
        move: dragMoveListener,
      }
    });
export function dragMoveListener (event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }