type CompactDisc = {
    title: string;
    artist: string;
    stock: number;
    price: number;
}

class Warehouse {
    constructor(public stockList: number[]) {}

}

class CD {
    constructor(public artist: string, public title: string, public stock: number, public price: number) {}

    buy() {
        if(this.stock > 0) {
            this.stock--;
        }
    }
}

describe('Compact Disc', () => {
    it('should be able to buy a CD', () => {
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        cd.buy();
        expect(cd.stock).toBe(9);
    });
    it('should not be able to buy a CD if there are none left', () => {
        const cd = new CD('The Beatles', 'Abbey Road', 0, 9.99);
        cd.buy();
        expect(cd.stock).toBe(0);
    });
})
