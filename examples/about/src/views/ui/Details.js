import { Events, Interface, Stage, basename } from 'alien.js';

import { Config } from '../../config/Config.js';
import { DetailsTitle } from './DetailsTitle.js';
import { DetailsLink } from './DetailsLink.js';

export class Details extends Interface {
    constructor() {
        super('.details');

        this.texts = [];

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.invisible();
        this.css({
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            pointerEvents: 'none',
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            width: 400,
            margin: '10% 10% 13%'
        });
        this.add(this.container);

        this.title = new DetailsTitle(basename('Multiuser Fluid').replace(/[\s.]+/g, '_'));
        this.container.add(this.title);
        this.texts.push(this.title);

        this.text = new Interface('.text', 'p');
        this.text.html('A fluid shader tribute to Mr.doob’s Multiuser Sketchpad from 2010. Multiuser Fluid is an experiment to combine UI and data visualization elements in a multiuser environment.');
        this.container.add(this.text);
        this.texts.push(this.text);
    }

    initViews() {
        const items = [
            {
                copy: 'Source code',
                link: 'https://glitch.com/edit/#!/multiuser-fluid'
            },
            {
                copy: 'Mr.doob’s Multiuser Sketchpad',
                link: 'https://glitch.com/edit/#!/multiuser-sketchpad'
            },
            {
                copy: 'David A Roberts’ Single-pass Fluid Solver',
                link: 'https://www.shadertoy.com/view/XlsBDf'
            }
        ];

        items.forEach(data => {
            const link = new DetailsLink(data.copy, data.link);
            link.css({
                display: 'block',
                width: 'fit-content'
            });
            this.container.add(link);
            this.texts.push(link);
        });
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.css({ display: '' });

            this.container.css({
                width: '',
                margin: '80px 20px 40px'
            });
        } else {
            this.css({ display: 'flex' });

            this.container.css({
                width: 400,
                margin: '10% 10% 13%'
            });
        }
    };

    /**
     * Public methods
     */

    animateIn = () => {
        this.clearTween().visible().css({
            pointerEvents: 'auto',
            opacity: 1
        });

        const duration = 2000;
        const stagger = 175;

        this.texts.forEach((text, i) => {
            const delay = i === 0 ? 0 : duration;

            text.clearTween().css({ opacity: 0 }).tween({ opacity: 1 }, duration, 'easeOutCubic', delay + i * stagger);
        });

        this.title.animateIn();
    };

    animateOut = () => {
        this.css({ pointerEvents: 'none' });

        this.clearTween().tween({ opacity: 0 }, 1800, 'easeOutExpo', () => {
            this.invisible();
        });
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
