import {BondScreen, DataScreen, Observer, PriceApp, StockScreen} from "./price-observer";
import {DataProvider, FinancialDataProvider} from "./financialDataProvider";

class StockProvider implements DataProvider {
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

describe('PriceApp', () => {
    let stockProvider = new StockProvider();
    let bondProvider = {addSubscriber: jest.fn(), notifyObservers: jest.fn(), getData: jest.fn()} as DataProvider;

    beforeEach(() => {
        stockProvider.getData = () => ({unilever: 'Unilever: $17'});
        bondProvider.getData = () => ({usGov: 'US Gov Bond: 104'});
    });

    it.only('should query data from DataProvider', () => {
        const providers = [stockProvider, bondProvider];
        const dataProvider = new FinancialDataProvider(providers);

        const priceObserver = new PriceApp(
            [new StockScreen(), new BondScreen()], dataProvider
            );
        expect(priceObserver.getScreens().map((screen: DataScreen) => screen.render())).toEqual(
            ['Unilever: $17', 'US Gov Bond: 104']
        )
    });

    it.skip('should update the Observers when data is changed', () => {
        const getData = jest.fn();
        getData
            .mockReturnValueOnce({unilever: '$17'})
            .mockReturnValueOnce({unilever: '$12'});
        stockProvider.getData = getData;
        const providers = [stockProvider, bondProvider];
        const dataProvider = new FinancialDataProvider(providers);
        const priceObserver = new PriceApp(
            [new StockScreen(), new BondScreen()],
            dataProvider
            );
        expect(priceObserver.getScreens().map((screen: DataScreen) => screen.render())).toEqual(
            ['$17', 'US Gov Bond: 104']
        );
        stockProvider.notifyObservers();

        expect(priceObserver.getScreens().map((screen: DataScreen) => screen.render())).toEqual(
            ['$12', 'US Gov Bond: 104']
        );
    });
});