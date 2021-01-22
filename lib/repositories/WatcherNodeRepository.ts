import WatcherNode from "../entities/WatcherNode";
import Property from "../entities/Property";

class WatcherNodeRepository {
    private watchers = Array<WatcherNode>();

    getWatcher(nodeName: string) {
        return this.watchers.find((w) => w.name === nodeName);
    }

    getAllWatchers() {
        return this.watchers;
    }

    updateWatcher(nodeName: string, isOnline: boolean) {
        let watcher;

        const found = this.getWatcher(nodeName);
        if (found) {
            watcher = found;
        } else {
            watcher = new WatcherNode();
            watcher.name = nodeName;
            watcher.props = Array<Property>();

            this.watchers.push(watcher);
        }

        watcher.isOnline = isOnline;
    }

    removeWatcher(nodeName: string) {

    }

    updateProperty(nodeName: string, propName: string, propValue: any) {
        const watcher = this.getWatcher(nodeName);
        if (!watcher) {
            return;
        }

        let prop;
        const found = watcher.props.find((p) => p.name === propName);
        if (found) {
            prop = found;
        } else {
            prop = new Property();
            prop.name = propName;

            watcher.props.push(prop);
        }

        prop.value = propValue;
        prop.updated = Date.now();
    }
}

const watcherNodeRepository = new WatcherNodeRepository();

export default watcherNodeRepository;
