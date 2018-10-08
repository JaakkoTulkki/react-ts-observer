import {DataProvider, DataScreen, Observer, Subject} from "./interfaces";
import {BondFakeDataProvider, FinancialDataProvider, ShareFakeDataProvider} from "./financialDataProvider";

class StockProvider implements DataProvider, Subject {
    private observers: Observer[] = [];
    public addSubscriber(subscriber: Observer) {
        this.observers.push(subscriber);
    };

    public getData() {

    };

    public notifyObservers() {
        const data = this.getData();

        for(let member of this.observers) {
            member.update(data);
        }
    }
}

export class StockScreen implements DataScreen {
    private data: string;
    public render() {
        return this.data;
    }

    public update(data: any) {
        if (data.unilever) {
            this.data = data.unilever;
        }
    }
}

export class BondScreen implements DataScreen {
    private data: string;
    public render() {
        return this.data;
    }

    public update(data: any) {
        if(data.usGov) {
            this.data = data.usGov;
        }
    }
}

describe('Subject', () => {
    let stockProvider = new StockProvider();

    beforeEach(() => {
        stockProvider.getData = () => ({unilever: 'Unilever: $17', usGov: 'US Bond 104'});
    });

    it('should update its subscribers on update', () => {
        const stockScreen = new StockScreen();
        const bondScreen = new BondScreen();
        stockProvider.addSubscriber(stockScreen);
        stockProvider.addSubscriber(bondScreen);

        expect(stockScreen.render()).toEqual(undefined);
        expect(bondScreen.render()).toEqual(undefined);

        stockProvider.notifyObservers();

        expect(stockScreen.render()).toEqual('Unilever: $17');
        expect(bondScreen.render()).toEqual('US Bond 104');
    });
});

describe('FinancialDataProvider', () => {
    it('should update the screens after the set interval', (done) => {
        const shareProvider = new ShareFakeDataProvider();
        const bondProvider = new BondFakeDataProvider();
        const dataProvider = new FinancialDataProvider([shareProvider, bondProvider], 1);

        const update = jest.fn();
        const fakeObserver: Observer = {
            update
        };
        dataProvider.addSubscriber(fakeObserver);
        setTimeout(() => {
            dataProvider.notifyObservers();
            expect(update).toHaveBeenCalled();
            expect(update).toHaveBeenCalledWith(expect.objectContaining(
                {unilever: expect.any(String), usGov: expect.any(String)}
                ))
            done();
        }, 2);

    });
});