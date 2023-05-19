import { _ } from '@galaxar/utils';
import TopoSort from './TopoSort';

class Graph {
    constructor(json) {
        this.topo = new TopoSort();

        if (json) {
            this.nodes = _.cloneDeep(json.nodes);
            if (!_.isEmpty(json.edges)) {
                _.forOwn(json.edges, (targets, source) => {
                    this.topo.add(source, targets);
                });
            }
            this.startNodes = json.startNodes;
            this.endNodes = json.endNodes;
        } else {
            this.nodes = {};
        }
    }

    hasNode(key) {
        return key in this.nodes;
    }

    getNode(key) {
        return this.nodes[key];
    }

    setNode(key, value) {
        this.nodes[key] = value;
        return this;
    }

    setEdge(sourceNode, targetNode) {
        if (!this.hasNode(sourceNode)) {
            throw new Error(`Source node [${sourceNode}] not exists.`);
        }
        if (!this.hasNode(targetNode)) {
            throw new Error(`Target node [${targetNode}] not exists.`);
        }
        this.topo.add(sourceNode, targetNode);
        return this;
    }

    getTargetNodes(sourceNode) {
        return Array.from(this.topo.mapOfDependents[sourceNode]);
    }

    getSourceNodes(targetNode) {
        return Array.from(this.topo.mapOfDependencies[targetNode]);
    }

    calcStartEnd() {
        const seq = this.topo.sort();
        this.startNodes = _.takeWhile(seq, (e) => !this.topo.hasDependency(e));
        this.endNodes = _.takeRightWhile(seq, (e) => !this.topo.hasDependent(e));

        if (this.startNodes.length === 0) {
            this.startNodes = Object.keys(this.nodes);
        }

        if (this.endNodes.length === 0) {
            this.endNodes = Object.keys(this.nodes);
        }

        return this;
    }

    toJSON() {
        return {
            nodes: this.nodes,
            edges: _.mapValues(this.topo.mapOfDependents, (nodes) => Array.from(nodes)),
            startNodes: this.startNodes,
            endNodes: this.endNodes,
        };
    }
}

export default Graph;
