import {DataProvider, Observer} from "./interfaces";
import {BondFakeDataProvider, FinancialDataProvider, ShareFakeDataProvider} from "./financialDataProvider";

export class StockScreen {
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

export class BondScreen {
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

describe('FinancialDataProvider', () => {

    it('should update its subscribers on update', () => {
        let stockProvider = new FinancialDataProvider(undefined, 0);
        stockProvider.getData = () => ({unilever: 'Unilever: $17', usGov: 'US Bond 104'});
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
                ));
            done();
        }, 2);
    });

    it('should update the screens', (done) => {
        const getData = jest.fn();
        getData.mockReturnValueOnce({unilever: '16'}).mockReturnValue({unilever: '22'});
        const fakeProvider = {getData} as DataProvider;

        const dataProvider = new FinancialDataProvider([fakeProvider], 1);
        const stockScreen = new StockScreen();
        dataProvider.addSubscriber(stockScreen);
        dataProvider.notifyObservers();
        expect(stockScreen.render()).toEqual('16');

        setTimeout(() => {
            expect(stockScreen.render()).toEqual('22');
            done();
        }, 2)
    });
});