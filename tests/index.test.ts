type CompactDisc = {
    title: string;
    artist: string;
    stock: number;
    price: number;
}

type CreditCard = {
    name: string;
    number: string;
    expiry: string;
    cvv: string;
}

class PaymentService {
    constructor(returnValue: boolean) {
        this.returnValue = returnValue;
    }

    returnValue: boolean;

    pay(amount: number, card: CreditCard): boolean {
        return this.returnValue;
    }
}

class Warehouse {
    constructor(public stockList: CompactDisc[]) {}

    addStock(cd: CompactDisc) {
        this.stockList.push(cd);
    }

    removeStock(cd: CompactDisc) {
        this.stockList = this.stockList.filter((item) => item !== cd);
    }

    getStockList() {
        return this.stockList;
    }

    getStockByTitle(title: string) {
        return this.stockList.filter((item) => item.title === title);
    }

    getStockByArtist(artist: string) {
        return this.stockList.filter((item) => item.artist === artist);
    }

}

class CD {
    constructor(public artist: string, public title: string, public stock: number, public price: number) {}

    buy(payment: PaymentService, cardDetails: CreditCard) {
        if(payment.pay(this.price, cardDetails)) {
            if (this.stock > 0) {
                this.stock--;
            }
        }
    }
}

describe('Compact Disc', () => {
    describe('buy', () => {
        describe('payment accepted', () => {
            it('should reduce stock by 1', () => {
                const cd = new CD('The Beatles', 'Abbey Road', 1, 10);
                const payment = new PaymentService(true);
                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                cd.buy(payment, cardDetails);
                expect(cd.stock).toBe(0);
            });
            it('should not reduce stock if stock is 0', () => {
                const cd = new CD('The Beatles', 'Abbey Road', 0, 10);
                const payment = new PaymentService(true);
                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                cd.buy(payment, cardDetails);
                expect(cd.stock).toBe(0);
            });
        });
        describe('payment rejected', () => {
            it('should not reduce stock', () => {
                const cd = new CD('The Beatles', 'Abbey Road', 1, 10);
                const payment = new PaymentService(false);
                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                cd.buy(payment, cardDetails);
                expect(cd.stock).toBe(1);
            });
        });
    });
})

describe('Warehouse', () => {
    it('should be able to add a CD to the stock list', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        warehouse.addStock(cd);
        expect(warehouse.getStockList()).toContain(cd);
    });
    it('should be able to remove a CD from the stock list', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        warehouse.addStock(cd);
        warehouse.removeStock(cd);
        expect(warehouse.getStockList()).not.toContain(cd);
    });
    it('should be able to get a list of CDs by title', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        const cd2 = new CD('The Beatles', 'Revolver', 10, 9.99);
        warehouse.addStock(cd);
        warehouse.addStock(cd2);
        expect(warehouse.getStockByTitle('Abbey Road')).toContain(cd);
        expect(warehouse.getStockByTitle('Revolver')).toContain(cd2);
    });
    it('should be able to get a list of CDs by artist', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        const cd2 = new CD('The Beatles', 'Revolver', 10, 9.99);
        const cd3 = new CD('The Rolling Stones', 'Sticky Fingers', 10, 9.99);
        warehouse.addStock(cd);
        warehouse.addStock(cd2);
        warehouse.addStock(cd3);
        expect(warehouse.getStockByArtist('The Beatles')).toContain(cd);
        expect(warehouse.getStockByArtist('The Beatles')).toContain(cd2);
        expect(warehouse.getStockByArtist('The Rolling Stones')).toContain(cd3);
    });
});
