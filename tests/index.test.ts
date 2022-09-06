type CreditCard = {
    name: string;
    number: string;
    expiry: string;
    cvv: string;
}

type Review = {
    rating: number;
    comment: string;
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
    constructor(public catalogue: CD[]) {}

    addToCatalogue(cd: CD | CD[]) {
        if (Array.isArray(cd)) {
            this.catalogue = this.catalogue.concat(cd);
        } else {
            this.catalogue.push(cd);
        }
    }

    removeFromCatalogue(cd: CD) {
        this.catalogue = this.catalogue.filter((item) => item !== cd);
    }

    getCatalogue() {
        return this.catalogue;
    }

    getCatalogueByTitle(title: string) {
        return this.catalogue.filter((item) => item.title === title);
    }

    getCatalogueByArtist(artist: string) {
        return this.catalogue.filter((item) => item.artist === artist);
    }

}

class CD {
    constructor(
      public id: number,
      public artist: string,
      public title: string,
      public stock: number,
      private price: number,
      private chartService: ChartService
    ) {}

    _reviews: Review[] = [];

    buy(payment: PaymentService, cardDetails: CreditCard, qty: number = 1) {
        // Do we update price here and query service?
        // Get position -> if <= 100 -> apply discount if applicable

        if (this.stock >= qty) {
            if(payment.pay(this.getPrice(), cardDetails)) {
                this.chartService.notify(this.artist, this.title, qty)
                this.stock -= qty;
            } else {
                throw new Error('Payment failed');
            }
        } else {
            throw new Error("Out of stock");
        }
    }

    addReview(review: Review) {
        this._reviews.push(review);
    }

    getReviews() {
        return this._reviews;
    }

    getPrice() {
        const DISCOUNT_VALUE = 1;
        const position = this.chartService.getPosition(this.id)

        if (position <= 100) {
            const lowestPrice = this.chartService.getLowestPrice(this.id);
            return lowestPrice - DISCOUNT_VALUE;
        }

        return this.price;
    }
}

class ChartService {
    notify(artist: string, title: string, qty:number) {
        // do something with this data
    }
    getPosition(id: number): number {
        return 0;
    }
    getLowestPrice(id: number): number {
        return 0;
    }
}

describe('Compact Disc', () => {
    describe('buy', () => {
        describe('should be able to buy more than 1 cd at a time', () => {
            //todo
        })
        describe('payment accepted', () => {
            it('should reduce stock by 1', () => {
                const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10, new ChartService());
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
            it('should throw an out of stock error if stock is 0', () => {
                const cd = new CD(99, 'The Beatles', 'Abbey Road', 0, 10, new ChartService());
                const payment = new PaymentService(true);
                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                expect(() => cd.buy(payment, cardDetails)).toThrow('Out of stock');
            });
        });
        describe('payment rejected', () => {
            it('should throw a payment rejected error', () => {
                const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10, new ChartService());
                const payment = new PaymentService(false);
                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                expect(() => cd.buy(payment, cardDetails)).toThrow('Payment failed');
            });
        });
        describe('notify chart of sale', () => {
            it('should notify the sale with artist and title of cd', () => {
                let chartServiceCall
                const mockChartService = {
                    notify: (artist, title, qty) => {
                        chartServiceCall = {
                            artist, title, qty
                        }
                    }
                } as ChartService

                const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10, mockChartService);
                const payment = new PaymentService(true);

                const cardDetails = {
                    name: 'John Doe',
                    number: '1234 5678 9012 3456',
                    expiry: '01/20',
                    cvv: '123',
                };
                cd.buy(payment, cardDetails)

                expect(chartServiceCall).toEqual({
                    title: 'Abbey Road',
                    artist: 'The Beatles',
                    qty: 1,
                })
            })
        })
    });
    describe('chart position', () => {
        it('should apply a discount of £1 if chart position <= 100', () => {
            const mockChartService = {
                getPosition: (id: number) => {
                    return 100;
                },
                getLowestPrice: (id: number) => {
                    return 6;
                }
            } as ChartService;

            const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10.99, mockChartService);

            const cdPrice = cd.getPrice();

            expect(cdPrice).toEqual(5)

        })
        it('should not apply a discount if chart position > 100', () => {
            const mockChartService = {
                getPosition: (id: number) => {
                    return 101; // Outside of range
                },
                getLowestPrice: (id: number) => {
                    return 6;
                }
            } as ChartService;

            const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10.99, mockChartService);

            const cdPrice = cd.getPrice();

            expect(cdPrice).toEqual(10.99)
        })
    })
    describe('add review', () => {
        it('should add a review to the cd', () => {
            const cd = new CD(99, 'The Beatles', 'Abbey Road', 1, 10, new ChartService());
            const review = {
                rating: 5,
                comment: 'Great album',
            };
            cd.addReview(review);
            expect(cd.getReviews()).toContainEqual(review);
        });
    });

})

describe('Warehouse', () => {
    it('should be able to add a CD to the stock list', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD(99, 'The Beatles', 'Abbey Road', 10, 9.99, new ChartService());
        warehouse.addToCatalogue(cd);
        expect(warehouse.getCatalogue()).toContain(cd);
    });
    it('should be able to add multiple CDs to the stock list', () => {
        const warehouse = new Warehouse([]);
        const cd1 = new CD(99, 'The Beatles', 'Abbey Road', 10, 9.99, new ChartService());
        const cd2 = new CD(99, 'The Beatles', 'Revolver', 10, 9.99, new ChartService());
        warehouse.addToCatalogue([cd1, cd2]);
        expect(warehouse.getCatalogue()).toContain(cd1);
        expect(warehouse.getCatalogue()).toContain(cd2);
    });
    it('should be able to remove a CD from the stock list', () => {
        const warehouse = new Warehouse([]);
        const cd = new CD(99, 'The Beatles', 'Abbey Road', 10, 9.99, new ChartService());
        warehouse.addToCatalogue(cd);
        warehouse.removeFromCatalogue(cd);
        expect(warehouse.getCatalogue()).not.toContain(cd);
    });
    it('should be able to get a list of CDs by title', () => {
        const warehouse = new Warehouse([]);
        const cd1 = new CD(99, 'The Beatles', 'Abbey Road', 10, 9.99, new ChartService());
        const cd2 = new CD(99, 'The Beatles', 'Revolver', 10, 9.99, new ChartService());
        warehouse.addToCatalogue([cd1, cd2]);
        expect(warehouse.getCatalogueByTitle('Abbey Road')).toContain(cd1);
        expect(warehouse.getCatalogueByTitle('Revolver')).toContain(cd2);
    });
    it('should be able to get a list of CDs by artist', () => {
        const warehouse = new Warehouse([]);
        const cd1 = new CD(99, 'The Beatles', 'Abbey Road', 10, 9.99, new ChartService());
        const cd2 = new CD(99, 'The Beatles', 'Revolver', 10, 9.99, new ChartService());
        const cd3 = new CD(99, 'The Rolling Stones', 'Sticky Fingers', 10, 9.99, new ChartService());
        warehouse.addToCatalogue([cd1, cd2, cd3]);
        expect(warehouse.getCatalogueByArtist('The Beatles')).toContain(cd1);
        expect(warehouse.getCatalogueByArtist('The Beatles')).toContain(cd2);
        expect(warehouse.getCatalogueByArtist('The Rolling Stones')).toContain(cd3);
    });
});

