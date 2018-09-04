import React, {Component} from 'react';
import './App.css';
import InputKey from './container/InputKey';
import Connect from './container/Connect';
import Toast from './component/Toast';
import model from './Model';


class App extends Component {
	render() {
		let {hasKey} = model;
		return (
			<div className="App">
				<Toast/>
				{
					hasKey ? <Connect/> : <InputKey/>
				}
			</div>
		);
	}
}

export default App;
