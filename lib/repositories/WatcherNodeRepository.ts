import WatcherNode from "../entities/WatcherNode";
import Property from "../entities/Property";

class WatcherNodeRepository {
    private watchers = Array<WatcherNode>();

    getNode(nodeName: string) {
        return this.watchers.find((w) => w.name === nodeName);
    }

    getAllNodes() {
        return this.watchers;
    }

    updateNode(nodeName: string, isOnline: boolean) {
        let node;

        const found = this.getNode(nodeName);
        if (found) {
            node = found;
        } else {
            node = new WatcherNode();
            node.name = nodeName;
            node.props = Array<Property>();

            this.watchers.push(node);
        }

        node.isOnline = isOnline;

        return node;
    }

    removeNode(nodeName: string) {

    }

    updateProperty(nodeName: string, propName: string, propValue: any) {
        const node = this.getNode(nodeName);
        if (!node) {
            return;
        }

        let prop: any;
        const found = node.props.find((p) => p.name === propName);
        if (found) {
            prop = found;
        } else {
            prop = new Property();
            prop.name = propName;

            node.props.push(prop);
        }

        prop.value = propValue;
        prop.updated = Date.now();

        return prop;
    }
}

const watcherNodeRepository = new WatcherNodeRepository();

export default watcherNodeRepository;
