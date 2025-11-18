import {randInRange, randFromList} from "./utils.js";

const PARTICLE_COUNT = 36;
const BUTTON_SIZE = 50;
const DURATION = 1000; // Duration of explosion animation in ms

/**
 * Initialize a button which explodes when you click on it.
 * 
 * @param {Element} container - The DOM container for this animation.
 */
export const init = (container) => {
    const button = document.createElement('button');
    button.textContent = '💥';
    button.style.position = 'absolute';
    button.style.left = '50%';
    button.style.top = '50%';
    button.style.margin = `-${BUTTON_SIZE/2}px 0 0 -${BUTTON_SIZE/2}px`;
    button.style.zIndex = '10';
    button.style.borderRadius = '100%';
    button.style.height = `${BUTTON_SIZE}px`;
    button.style.width = `${BUTTON_SIZE}px`;
    button.style.background = 'linear-gradient(135deg, rgba(255,120,120,1) 0%, rgba(255,40,40,1) 60%), radial-gradient(circle at 30% 30%, rgba(255,200,200,0.6), transparent 25%)';
    button.style.color = '#fcc';
    button.style.fontSize = '22px';
    button.style.fontWeight = '700';
    button.style.textShadow = '0 1px 0 rgba(0,0,0,0.2)';
    button.style.boxShadow = '0 10px 20px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.12)';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.border = 'none';
    button.style.padding = '8px';
    button.style.transition = 'transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms, background 220ms';
    button.style.outline = 'none';

    button.addEventListener('click', () => explode(button));
    container.appendChild(button);
};

/**
 * Run the explosion animation.
 * 
 * @param {Element} btn 
 */
const explode = (btn) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = window.scrollY + rect.top + rect.height / 2;

    // Small scale/pop animation for the button itself
    btn.animate([
        { transform: 'scale(1)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
        { transform: 'scale(1.18)', boxShadow: '0 18px 28px rgba(0,0,0,0.28)' },
        { transform: 'scale(0.94)', boxShadow: '0 6px 12px rgba(0,0,0,0.18)' },
        { transform: 'scale(1)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }
    ], { duration: DURATION, easing: 'cubic-bezier(.2,.8,.2,1)' });

    const colors = ['#ef4444', '#fb7185', '#fb923c', '#f97316', '#f59e0b', '#ffd6a5'];
    const count = PARTICLE_COUNT;

    for (let i = 0; i < count; i++) {
        const size = randInRange([6, 20]);
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.position = 'absolute';
        particle.style.left = `${cx - size / 2}px`;
        particle.style.top = `${cy - size / 2}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9';

        // pick a color
        particle.style.background = randFromList(colors);

        document.body.appendChild(particle);

        // random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = randInRange([60, 220]);
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rotate = randInRange([-180, 180]);
        const finalScale = randInRange([0.4, 1.8]);
        const duration = randInRange([550, 1250]);

        const anim = particle.animate([
            { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(${finalScale}) rotate(${rotate}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(.2,.8,.2,1)',
            fill: 'forwards'
        });

        anim.onfinish = () => particle.remove();
    }
};
