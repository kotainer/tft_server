import * as Rate from '../../models/rate';

export class Rates {
    constructor() {

    }

    getRateByDate = async (ctx) => {
        if (!ctx.query || !ctx.query.date) {
            return {
                result: false,
                message: 'Invalid date'
            }
        }

        const date = ctx.query.date;

        try {
            const rates = await Rate.aggregate([
                {
                    $project: {
                        createdAt: 1,
                        prices: 1,
                        difference: {
                            $abs: {
                                $subtract: [date, "$createdAt"]
                            }
                        }
                    }
                },
                {
                    $sort: { difference: 1 }
                },
                {
                    $limit: 1
                }
            ]);

            if (rates && rates.length) {
                return {
                    result: true,
                    data: rates[0].prices || null
                }
            }

            return {
                result: false,
                message: 'Not rates by date'
            }
        } catch (e) {
            return {
                result: false,
                message: e
            }
        }
    }
}
