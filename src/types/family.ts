// 定义家族成员的基本信息接口
export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  deathDate?: string;
  description?: string;
  imageUrl?: string;
}

// 定义族谱树节点接口，继承自家族成员，并添加子节点信息
export interface FamilyTreeNode extends FamilyMember {
  children?: FamilyTreeNode[];
  spouse?: FamilyMember;
}

// 定义完整的家族树接口
export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  rootNode: FamilyTreeNode;
}

// 定义示例数据
export const sampleFamilyTree: FamilyTree = {
  id: 'sample-family',
  name: '示例家族',
  description: '这是一个示例家族树',
  rootNode: {
    id: 'ancestor-1',
    name: '祖先',
    gender: 'male',
    birthDate: '1900-01-01',
    children: [
      {
        id: 'child-1',
        name: '长子',
        gender: 'male',
        birthDate: '1925-01-01',
        children: [
          {
            id: 'grandchild-1',
            name: '长孙',
            gender: 'male',
            birthDate: '1950-01-01'
          }
        ]
      },
      {
        id: 'child-2',
        name: '次子',
        gender: 'male',
        birthDate: '1927-01-01'
      }
    ]
  }
};