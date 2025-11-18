import { init as initBounce } from './bounce.js';
import { init as initNebula } from './nebula.js';
import { init as initExplosion } from './explosion.js';
import { init as initDancer } from './dancer.js';

window.addEventListener('load', () => {
    const top = document.createElement('div');
    top.className = 'demo-top';
    document.body.appendChild(top);

    const createContainer = () => {
        const container = document.createElement('div');
        container.className = 'demo-container';
        top.appendChild(container);
        return container;
    };

    [
        initBounce,
        initNebula,
        initExplosion,
        initDancer,
    ].forEach(init => init(createContainer()));
});
