
import * as React from 'react'
import * as showdown from 'showdown'
import styles from './styles'
import {store} from './store'

type Props = {
    className?: string;
    content: string;
}

const markdown = new showdown.Converter({
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    tables: true,
})

;(async function() {
    const plugins = await import('./showdown-plugins' /* webpackChunkName: 'plugins' */);
    
    plugins.default.forEach(plugin => {
        markdown.addExtension(plugin, plugin.name);
    });
    
    store.dispatch({type: 'RENDER'});
})();

function doCopy(text: string) {
    const element = document.createElement('textarea');
    element.value = text;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
}

export class Markdown extends React.Component<Props> {
    private element: HTMLElement | null;
    
    componentDidMount() {
        // mounted, but rendering is delayed by makeHtml() / DOM insertion.
        setTimeout(() => {
            if (!this.element) return;
            this.element.querySelectorAll('.code-button')
            .forEach(button => {
                
                const target = button.previousElementSibling as HTMLElement;
                if (!target) return;
                
                button.addEventListener("click", event => {
                    event.stopPropagation();
                    doCopy(target.innerText);
                    return true;
                });
            })
        }, 300);
    }
    
    render() {
        return (
            <div
                ref={r => this.element = r}
                className={(this.props.className || '') + ' ' + styles("md")}
                dangerouslySetInnerHTML={{
                    __html: markdown.makeHtml(this.props.content)
                }}
            />
        )
    }
}
