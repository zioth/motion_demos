import {Animation} from './Animation.js';
import {randInRange, randFromList, coinflip} from './utils.js';

const SIZE = 32;
const COUNT = 15;
const COLORS = [
    'rgb(96,165,250)',
    'rgb(59,130,246)',
    'rgb(37,99,235)',
    'rgb(139,92,246)',
    'rgb(167,139,250)',
    'rgb(124,58,237)',
    'rgb(52,211,153)',
    'rgb(16,185,129)',
    'rgb(34,197,94)',
    'rgb(34,211,238)',
    'rgb(14,165,233)',
    'rgb(251,113,133)',
    'rgb(236,72,153)',
    'rgb(249,115,22)',
    'rgb(245,158,11)',
    'rgb(234,179,8)',
    'rgb(244,63,94)',
    'rgb(168,85,247)',
    'rgb(255,195,113)',
    'rgb(99,102,241)'
];

// Min and max speed for animations
const MOVE_SPEED = [5, 15];
const SCALE_SPEED = [2.2, 5.2];
const ROTATE_SPEED = [8, 14];
const OPACITY_SPEED = [3, 7];
const GLOW_SPEED = [4, 10];

/**
 * Initialize an animation of circles that move, rotate and pulse.
 * 
 * @param {Element} container 
 */
export const init = (container) => {
    // This demo is allowed to leave its bounds and overlap others.
    container.style.zIndex = container.style.zIndex || '1';

    const dots = [];
    const animations = [];

    const addDot = () => {
        const dot = createDot(container);
        dots.push(dot);

        // Each dot moves, rotates and pulses with random speeds.
        animations.push(new Animation(container, dot, () => {
            const glowStart = parseInt(getComputedStyle(dot).getPropertyValue('--glow')) || 12;
            const glowMin = Math.max(4, Math.round(glowStart * 0.75));
            const glowMax = Math.round(glowStart * 1.35);
            const scaleStart = parseFloat(
                getComputedStyle(dot)
                .getPropertyValue('transform')
                .match(/matrix\(([^,]+),/)[1]
            ) || 1;
            const opacityStart = parseFloat(getComputedStyle(dot).getPropertyValue('opacity')) || 1;

            return [
                [
                    {x: ['0%', '90%']},
                    {
                        duration: randInRange(MOVE_SPEED),
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: 0
                    }
                ],
                [
                    {y: ['0%', '90%']},
                    {
                        duration: randInRange(MOVE_SPEED),
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: 0
                    }
                ],
                // Opacity pulse
                [
                    {opacity: [opacityStart, 0.6, 1]},
                    {
                        duration: randInRange(OPACITY_SPEED),
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut'
                    }
                ],
                // Animate the glow size via a CSS variable so the visual type (solid vs halo) never changes
                [
                    {'--glow': [`${glowStart}px`, `${glowMin}px`, `${glowMax}px`]},
                    {
                        duration: randInRange(GLOW_SPEED),
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut'
                    }
                ],
                [
                    {rotate: 360},
                    {
                        duration: randInRange(ROTATE_SPEED),
                        repeat: Infinity,
                        ease: 'linear'
                    }
                ],
                [
                    {scale: [scaleStart, 0.6, 1.35]},
                    {
                        duration: randInRange(SCALE_SPEED),
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut'
                    }
                ],
            ];
        }));

        // If the animation is already playing, play the new dot too.
        if (animations.length > 1 && animations[0].isPlaying()) {
            animations[animations.length - 1].play();
        }
    };

    const removeDot = () => {
        if (animations.length === 0) {
            return;
        }
        animations.pop().clear();
        dots.pop().remove();
    };

    const addControls = () => {
        const makeButton = (text, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = 'tiny-button';
            button.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
            return button;
        };
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.top = '8px';
        controls.style.right = '8px';
        controls.style.display = 'flex';
        controls.style.gap = '6px';
        controls.style.zIndex = '50';
        controls.appendChild(makeButton('+', addDot));
        controls.appendChild(makeButton('-', removeDot));
        container.appendChild(controls);
    }

    addControls();
    for (let i = 0; i < COUNT; i++) {
        addDot();
    }

    container.addEventListener('click', () => animations.forEach(a => a.toggle()));
};

/**
 * Create a dot element that can be animated.
 * 
 * @param {Element} container 
 * @returns {Element}
 */
const createDot = (container) => {
    const dot = document.createElement('div');
    dot.className = 'nebula-dot';
    dot.style.width = dot.style.height = `${SIZE}px`;
    dot.style.borderRadius = '50%';
    dot.style.position = 'absolute';
    dot.style.left = `${randInRange([0, 90])}%`;
    dot.style.top = `${randInRange([0, 90])}%`;
    dot.style.transform = `scale(${randInRange([0.6, 1.35])})`;
    dot.style.pointerEvents = 'none';
    const baseColor = randFromList(COLORS);
    const nextColor = randFromList(COLORS);

    const isSolid = coinflip(); // filled or halo
    if (isSolid) {
        dot.style.background = `radial-gradient(circle at 30% 30%, ${baseColor}, ${nextColor})`;
        // subtle shadow for solid dots
        dot.style.setProperty('--glow', `${Math.round(6 + SIZE / 3)}px`);
        dot.style.boxShadow = `0 4px var(--glow) ${baseColor}`;
        dot.style.opacity = '1';
    } else {
        // halo: transparent center, glow via box-shadow
        dot.style.background = 'transparent';
        dot.style.setProperty('--glow', `${Math.round(10 + SIZE / 2)}px`);
        dot.style.boxShadow = `0 0 var(--glow) ${baseColor}`;
        dot.style.opacity = '0.9';
    }
    container.appendChild(dot);
    return dot;
};