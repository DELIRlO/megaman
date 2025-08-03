document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const megaman = document.getElementById('megaman');
    const cooldown = 3000;
    const animationDuration = 800;

    const nameTemplate = '<h1 id="destroyable-name">Carlos Augusto Diniz Filho</h1>';

    /**
     * Função para lidar com a destruição do elemento.
     */
    function handleDestruction() {
        const nameElement = document.getElementById('destroyable-name');
        if (!nameElement) return;


        if (megaman) {
            megaman.classList.add('attack');
        }
        nameElement.classList.add('destroyed');


        setTimeout(() => {
            if (nameElement) {
                nameElement.remove();
            }


            if (megaman) {
                megaman.classList.remove('attack');
            }
            

            setTimeout(regenerateName, cooldown);

        }, animationDuration);
    }

    /**
     * Função para recriar o elemento e reanexar o listener.
     */
    function regenerateName() {

        if (container) {
            container.insertAdjacentHTML('beforeend', nameTemplate);
        }

        setupClickListener();
    }

    /**
     * Função para encontrar o elemento do nome e anexar o listener.
     * Usar { once: true } previne cliques múltiplos durante a animação.
     */
    function setupClickListener() {
        const nameElement = document.getElementById('destroyable-name');
        if (nameElement) {
            nameElement.addEventListener('click', handleDestruction, { once: true });
        }
    }


    setupClickListener();
});
