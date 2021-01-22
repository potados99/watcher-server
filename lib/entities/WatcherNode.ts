class WatcherNode {
    id: number;
    name: string;
    props: Map<string, any>; // Property can be anything: like battery voltage, or usb connection.
}

export default WatcherNode;
