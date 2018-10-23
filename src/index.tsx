import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FinancialDataProvider} from "./price-observer/financialDataProvider";

interface DataScreenProps {
    dataProvider: FinancialDataProvider;
}
interface StockState {
    unilever: string;
}

class ReactStockScreen extends React.Component<DataScreenProps, StockState> {
    constructor(props: DataScreenProps) {
        super(props);
        props.dataProvider.addSubscriber(this);
        this.state = {
            unilever: ''
        };
    }

    public update(data: any) {
        if (data.unilever) {
            this.setState({unilever: data.unilever});
        }
    }

    public render() {
        return <div>{this.state.unilever}</div>
    }
}

interface BondState {
    usGov: string;
}

class ReactBondScreen extends React.Component<DataScreenProps, BondState> {
    constructor(props: DataScreenProps) {
        super(props);
        props.dataProvider.addSubscriber(this);
        this.state = {
            usGov: '',
        };
    }

    public update(data: any) {
        if (data.usGov) {
            this.setState({usGov: data.usGov});
        }
    }

    public render() {
        return <div>{this.state.usGov}</div>
    }
}

const dataProvider = new FinancialDataProvider();

const App = () => (
    <div>
        <ReactStockScreen dataProvider={dataProvider} />
        <br/>
        <ReactBondScreen dataProvider={dataProvider} />
    </div>
);

ReactDOM.render(
    <App />,
    document.getElementById("app")
);