import create, { Receipt, ReceiptItem, ReceiptOptions } from 'receipt';
import { printer, ConfigProps } from 'node-thermal-printer';

interface PrinterOptions<T> {
    printer: ConfigProps;
    receipt: ReceiptOptions;
    formatter: (item: T) => string;
    header?: string;
    footer?: string;
}

class ThermalPrinter<T> extends printer {
    private receiptConf: Receipt;
    private formatter: (item: T) => string;
    private header?: string;
    private footer?: string;

    /**
     * Printer class to handle POS printers.
     * @param conf Configuration for printer, receipt and formatting
     */
    constructor(conf: PrinterOptions<T>) {
        super(conf.printer);
        this.receiptConf = create(conf.receipt);
        this.formatter = conf.formatter;
        this.header = conf.header;
        this.footer = conf.footer;
    }

    /**
     * Print products as receipt.
     * @param items Items of given type
     */
    printReceipt(items: T[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const text = '';
            const lineSep = ''.padStart(this.receiptConf.options.width, '-')
            try {
                this.clear();
                this.openCashDrawer();
                if (this.header) {
                    this.print(this.header);
                    this.print(lineSep);
                }
                this.print(text);
                if (this.footer) {
                    this.print(lineSep);
                    this.print(this.footer);
                }
                this.cut();
                this.clear();
                resolve();
            } catch (err) {
                reject(err)
            }
        });
    }
}

export default ThermalPrinter;

const _printer = new ThermalPrinter<{ name: string, sku: string }>({
    printer: {
        interface: "",
        width: 40,
        options: {
            timeout: 3000
        }
    },
    receipt: {
        currency: '$',
        locale: 'en-ca',
        width: 40
    },
    formatter: (item) => item.name
});