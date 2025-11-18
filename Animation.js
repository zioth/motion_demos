import {animate} from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

/**
 * A collection of animations for a DOM element.
 */
export class Animation {
    /**
     * Constructor
     * 
     * @param {Element} container - The parent element
     * @param {Element} elt - The element to animate
     * @param {Function} initializers - A function that returns an array animations, as defined
     *   by the Motion library. Each animation is an array of animation parameters.
     * @param {Function} onfinish - Optional callback when the first animation finishes.
     */
    constructor(container, elt, initializers, onfinish = null) {
        this.container = container;
        this.elt = elt;
        this.running = false;
        this.initializers = initializers;
        this.animations = [];
        this.onfinish = onfinish;
    }

    /**
     * Start or restart the animation.
     */
    start() {
        this.animations.forEach(a => a.stop());
        this.animations = [];
        const options = this.initializers();
        for (const opt of options) {
            this.add(...opt);
        }
    }

    /**
     * Add an animation to the list.
     * 
     * @param  {...any} animations
     */
    add(...animations) {
        const animation = animate(this.elt, ...animations);
        if (this.onfinish && this.animations.length === 1) {
            animation.finished.then(this.onfinish);
        }
        if (this.running) {
            animation.play();
        }
        this.animations.push(animation);
    }

    /**
     * Clear all animations.
     */
    clear() {
        this.animations.forEach(a => a.stop());
        this.animations = [];
    }

    /**
     * @returns true if the animation is playing.
     */
    isPlaying() {
        return this.running;
    }

    /**
     * Play the animations.
     */
    play() {
        if (!this.running) {
            if (this.animations.length === 0) {
                this.start();
            } else {
                this.animations.forEach(a => a.play());
            }
            this.running = true;
        }
    }

    /**
     * Pause the animations.
     */
    pause() {
        if (this.running) {
            this.animations.forEach(a => a.pause());
            this.running = false;
        }
    }

    /**
     * Toggle the animations between play and pause.
     */
    toggle() {
        if (!this.running) {
            this.play();
        } else {
            this.pause();
        }
    }
};
