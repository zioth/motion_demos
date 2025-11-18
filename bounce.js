import {Animation} from './Animation.js';
import {randFromList, randInRange} from './utils.js';

const G = 1000; // Gravity
const REST = 0.85; // Restitution coefficient (energy loss). Higher is bouncier.
const SAMPLE_RATE = 30; // Samples per second to build keyframes
const SIZE = 5; // The bouncing object takes up this percent of the container's width/height
const MAX_SPACE = 100 - SIZE;
const SPAWN_FREQUENCY = 2000; // milliseconds between spawns
const SPEED = 6; // Speed factor for vertical movement. Lower is faster.

/**
 * Initialize an animation of random bouncing shapes.
 * 
 * @param {Element} container - The DOM container for this animation.
 */
export const init = (container) => {
    let lastId = 0;
    let spawnTimer = null;
    const animations = new Map();
    const spawnObject = () => {
        const x = randInRange([10, MAX_SPACE - 10]);
        const elt = makeElement(x);
        container.appendChild(elt);
        const {leftFrames, topFrames, totalDuration} = buildKeyframes(x);
        const animation = new Animation(
            container,
            elt,
            () => [
                [{left: leftFrames}, {duration: totalDuration, ease: 'linear'}],
                [{top: topFrames}, {duration: totalDuration, ease: 'linear'}],
                [{rotate: [0, randInRange([-1800, 1800])]}, {duration: totalDuration, ease: 'linear'}]
            ],
            () => {
                animation.clear();
                animations.delete(lastId);
                elt.remove();
            }
        );
        if (animations.values().next()?.value?.isPlaying()) {
            animation.play();
        }
        animations.set(++lastId, animation);
    };

    spawnObject();

    // Click to start/pause (preserve original behavior)
    container.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!animations.values().next()?.value?.isPlaying()) {
            animations.forEach(a => a.play());
            spawnTimer = setInterval(() => {
                spawnObject();
            }, SPAWN_FREQUENCY);
        } else {
            animations.forEach(a => a.pause());
            clearInterval(spawnTimer);
            spawnTimer = null;
        }
    });
};

/**
 * Create an element to be bounced.
 * 
 * @param {number} startX The starting horizontal position (%)
 * @returns {Element}
 */
const makeElement = (startX) => {
    const shapes = [
        {name: 'circle', style: {borderRadius: '50%'}},
        {name: 'square', style: {borderRadius: '20%'}},
        {name: 'triangle', style: {clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}},
        {name: 'hexagon', style: {clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}},
    ];
    const rcolor = () => Math.floor(randInRange([50, 255]));
    const elt = document.createElement('div');

    const shape = randFromList(shapes);
    for (const [key, value] of Object.entries(shape.style)) {
        elt.style[key] = value;
    }
    elt.style.width = `${SIZE}%`;
    elt.style.height = `${SIZE}%`;
    elt.style.background = `linear-gradient(135deg, rgba(${rcolor()},${rcolor()},${rcolor()},1) 0%, rgba(${rcolor()},${rcolor()},${rcolor()},1) 100%)`;
    elt.style.position = 'absolute';
    elt.style.left = `${startX}%`;
    elt.style.top = 0;
    elt.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.2)';
    return elt;
};

/**
 * Build sampled keyframes for a damped bounce sequence starting from y=0.
 * 
 * @param {number} startX The starting horizontal position (%)
 * @returns {{leftFrames: string[], topFrames: string[], totalDuration: number}}
 */
const buildKeyframes = (startX) => {
    const h0 = MAX_SPACE;
    const leftFrames = [];
    const topFrames = [];

    // Compute bounce peak heights and durations. The first entry is the initial fall.
    const data = [{peak: h0, duration: SPEED * Math.sqrt(2 * h0 / G)}];
    let H = h0 * REST * REST;
    for (let i = 0; i < 8 && H >= 1; i++) {
        data.push({peak: H, duration: SPEED * Math.sqrt(2 * H / G)});
        H *= REST * REST;
    }

    // sample each bounce arc
    let x = startX;
    let velocityX = randInRange([-25, 25]); // %/s
    data.forEach((d, i) => {
        const peak = d.peak;
        const samples = Math.max(4, Math.round(d.duration * SAMPLE_RATE));
        const dt = d.duration / samples; // seconds per sample
        for (let s = 0; s < samples; s++) {
            const t = s / (samples - 1);
            const y = (() => {
                if (i === 0) {
                    // quadratic ease-in (parabolic fall)
                    return h0 * t * t;
                } else {
                    // parabola symmetric arc from ground -> peak -> ground
                    return 4 * peak * Math.pow(t - 0.5, 2) + h0 - peak;
                }
            })();

            x += velocityX * dt;
            if (x >= MAX_SPACE) {
                velocityX = -velocityX;
                x = 2 * MAX_SPACE - x;
            } else if (x <= 0) {
                velocityX = -velocityX;
                x = -x;
            }

            leftFrames.push(`${x}%`);
            topFrames.push(`${Math.max(0, Math.min(h0, y))}%`);
        }
    });

    return {
        leftFrames,
        topFrames,
        totalDuration: data.reduce((a, b) => a + b.duration, 0)
    };
};