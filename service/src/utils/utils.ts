import _ from "lodash";
export function transformTree(original: any) {
  original = _.sortBy(original, (o) => {
    return o.sort;
  });
  const parents = original.filter((item: any) => item.parentId === null);
  const children = original.filter((item: any) => item.parentId !== null);
  tree(parents, children);
  function tree(parents, children) {
    for (let index = 0; index < parents.length; index++) {
      const parent = parents[index];
      for (let subIndex = 0; subIndex < children.length; subIndex++) {
        const child = children[subIndex];
        if (Number(child.parentId) === Number(parent.id)) {
          const _children = _.cloneDeep(children);
          _children.splice(subIndex, 1);
          if (parent.children) {
            parent.children = [...tree([child], _children), ...parent.children];
          } else {
            parent.children = [...tree([child], _children)];
          }
        }
      }
      if (parent.children && parent.children.length) {
        const parentChildren = _.cloneDeep(parent.children);
        parent.children = _.sortBy(parentChildren, (o) => {
          return o.sort;
        });
      }
    }
    return parents;
  }
  return parents;
}
