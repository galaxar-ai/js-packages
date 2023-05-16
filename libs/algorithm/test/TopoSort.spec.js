import { TopoSort } from '../lib';

describe('unit:TopoSort', function () {
    let topoSort = new TopoSort();

    topoSort.add('step1', ['step2', 'step3']);
    topoSort.add('step2', ['step4', 'step5']);
    topoSort.add('step2', 'step6');
    topoSort.add('step3', 'step6');

    it('adding', function () {
        let step2Dep = topoSort.hasDependency('step2');
        step2Dep.should.be.ok();

        step2Dep = topoSort.hasDependent('step2');
        step2Dep.should.be.ok();

        let step1Dep = topoSort.hasDependent('step1');
        step1Dep.should.be.ok();

        step1Dep = topoSort.hasDependency('step1');
        step1Dep.should.not.be.ok();

        let step4Dep = topoSort.hasDependency('step4');
        step4Dep.should.be.ok();

        step4Dep = topoSort.hasDependent('step4');
        step4Dep.should.not.be.ok();
    });

    it('sort', function () {
        let sorted = topoSort.sort();

        sorted.should.be.deepEqual([
            'step1',
            'step2',
            'step3',
            'step4',
            'step5',
            'step6',
        ]);
    });

    it('throw on circular dependence', function () {
        topoSort.add('step5', 'step1');

        should.throws(() => topoSort.sort());
    });
});
