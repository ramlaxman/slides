
import * as React from 'react';
import { render } from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import * as qs from 'qs'

import style from './styles';
import { store, persistor } from './store'
import './icons';

import Head from './head'
import Dark from './dark'
import Toolbar from './toolbar'
import EditorView from './editor'
import PresentView from './presentation'
import FileModal from './files'
import HelpModal from './help'


class App extends React.Component {
    
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Dark id={style('app')}>
                        <Head/>
                        <Toolbar/>
                        <div className={style("split-view")}>
                            <EditorView/>
                            <PresentView/>
                        </div>
                        <FileModal/>
                        <HelpModal/>
                    </Dark>
                </PersistGate>
            </Provider>
        )
    }
}

async function loadParams() {
    const params = qs.parse(window.location.search.slice(1));
    let url = params.url as string;
    
    if (typeof params.tutorial !== "undefined") {
        url = window.location.host + window.location.pathname + "tutorial.md";
    }
    
    if (url) {
        url = window.location.protocol + "//" + url.replace(/^https?:/, '');
        
        const req = await fetch(url, {
            mode: 'cors',
            redirect: 'follow',
        });
        
        const content = await req.text();
        store.dispatch({ type: "LOAD", content });
    }
}

render(<App/>, document.getElementById("root") as HTMLElement)
loadParams();

