import {Animation} from './Animation.js';

// A small dancing man animation that walks around the inside edge of the container
export const init = (container) => {
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const man = document.createElement('div');
    man.className = 'dancer-man';
    // Use emoji so there's no external asset; style it to be visible
    man.textContent = '🕺';
    man.style.position = 'absolute';
    man.style.left = '4%';
    man.style.top = '4%';
    man.style.fontSize = '36px';
    man.style.lineHeight = '1';
    man.style.transformOrigin = '50% 50%';
    man.style.transform = 'rotate(180deg)';
    man.style.pointerEvents = 'auto';
    container.appendChild(man);

    const dancer = new Animation(container, man, () => {
        return [
            // Path: top-left -> top-right -> bottom-right -> bottom-left -> top-left
            [
                {
                    left: ['4%', '84%', '84%', '4%', '4%'],
                    top: ['4%', '4%', '84%', '84%', '4%']
                },
                {duration: 8, repeat: Infinity, ease: 'linear'}
            ],
            // Wiggle to create the illusion of dancing.
            [
                {
                    rotate: [
                        ...addAngle([-12, 12, -8, 8], 180),
                        ...addAngle([-12, 12, -8, 8], -90),
                        ...addAngle([-12, 12, -8, 8], 360),
                        ...addAngle([-12, 12, -8, 8], -270),
                    ],
                    scale: [
                        1, 1.05, 0.95, 1.05,
                        1, 1.05, 0.95, 1.05,
                        1, 1.05, 0.95, 1.05,
                        1, 1.05, 0.95, 1.05,
                    ]
                },
                {duration: 8, repeat: Infinity, ease: 'easeInOut'}
            ]
        ];
    });

    const addAngle = (angles, add) => angles.map(a => a + add);

    container.addEventListener('click', (e) => { e.stopPropagation(); dancer.toggle(); });
};
