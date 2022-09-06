class CD {
    constructor(public artist: string, public title: string, public stockLevel: number, public price: number) {

    }

    buy() {
        this.stockLevel--;
    }
}

describe('Compact Disc', () => {
    it('should be able to buy a CD', () => {
        const cd = new CD('The Beatles', 'Abbey Road', 10, 9.99);
        cd.buy();
        expect(cd.stockLevel).toBe(9);
    });
})
