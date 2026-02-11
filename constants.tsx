
import React from 'react';

export const COLORS = {
  primary: '#4bee2b',
  secondary: '#ff8a4c',
  accent: '#f0a742'
};

export const IMAGES = {
  pawHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5DC-3W_qtA5otNLq4PVDdXEq5pJVSURWTcjUjXAFRZxDsbiqHtO-HKPgpab6NNFVa6H3eqOmn5y2cGbcyWrKsyn8aqOWXJFaGfWXAqs6pOM5HUl-T_IpuuACeKcEc8S0OZIP78B-H5Enf5rakfic60VTtHRBP64CofRPAuot82gSDTPnurKp3CB0nXxOC905jT4k4k7uBR-dmUdNC56aWoR2Rr7z8UxVN5bFVQOOPshWkrDJxzlc-Cd_2bPMalVGWdjb759yGAso',
  goldenForm: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZWK0FqR1ZyMV-SRcSnyT65DO0L2rDO-_Tf5CybQWeF2TCszs1E8YIzCvzahQcBE48A4b62vC3LfFGEPgN0GV7O3dfDu37bExe4hjarU9wr3MI_98HwY7vXeSIhWjdhhv7yynVs62zWQGXz5y_prD8rUoO0IKkhqhIdpIKdgsBPbG_nnPndId3eFbxyZfEJDKLOcreZ3jlCGSSlllNNVF51W_iBEa9MPC3ik04it4AwHnA_R9XaYDlUx_H97UqEPq1IzgCGFv4thY',
  buddyDetail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7aanf2acIeGpDI_waiioYctAIQdW5c3o5GPKKa2xf2e99REHzuBCZ-wedApSu4iu5Y83hWBMOUlbv29vixteR5n9_5StM27JUraRdlFGqKf36NC8JJymH2tMZdE5pr2-qCZBiJg_4Km5ANSLRwYMtT5kDz-CjHI_zzmcTrgV2TlyAagloFup92hr8FpwKiGHrRgRhEJcWHaDo40chgwW2KRPQT4paOV3R1wqZq3ud-4MgjPqVafQld3wegmoLqKzk_TSOvlUJ6GM',
  userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANg9HC1yBxrxdgrxZbgFz729Mpef68EVctUSDvhJ1nZI86JAXrMWMHIA-N9DUYAemkWeemk6J6wLkDD6GypyFnzFGCHd7WWUj7jFxRD2OO_VrGxsdO_k5x0UPEjUerSUzvZkdAgqBhlETA8IQXEz8e5x1pPNnSk9jiqFUe-AWVudlNIqxbwJrEzUKOqbbHf2O0C-wQMwUVqfdzGWNZHVH8l1IcYQT_K1983hlQtUpGPLePQS48Kx8VhJKWNxiRkXI_X_jvQ60iM_U'
};

export const SAMPLE_PETS = [
  {
    id: '1',
    name: '布鲁 (Blue)',
    breed: '边境牧羊犬',
    age: '2 岁',
    gender: '公',
    weight: '18kg',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkvn3a8GOUDdE_N_zhV6Yx9Wc5J37aNba0fZ7ZFaMqxek_2WIRSI7gfXBkS_UQi8eJBhtF5vm1yMVCVPaKBDkNeOBiX5k-irweLCbPjDZflZvriMsjFGh6XxVVJR3GUknAZWx0ueaiBRClwraErrOjExCLDcouKz-SOUtHejDQePTe2-CJgU4t-I4QIrstHQYkrPZ3nMMs9oY28Sw1xgKgq4WUsqgZpcCtyRt88Dw8colhKGyXsvoDo77kY11lWhUWB_-ipOjrbIA',
    category: '狗狗',
    isVaccinated: true,
    isNeutered: true,
    tags: ['对儿童友好', '活泼', '聪明'],
    description: '布鲁是一只非常聪明的边牧，它已经掌握了基本的服从指令，非常适合有户外活动习惯的家庭。'
  },
  {
    id: '2',
    name: '大白 (Dabai)',
    breed: '拉布拉多',
    age: '4 个月',
    gender: '母',
    weight: '12kg',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA_i2f-s6lL9PsDSu1K9mmW-cbz71bvRwhXxg285ubHag3FyOaSHLF-IZuN_OevC7b7HEgsd5rlrnW-AO65xfKRQPN3oCOQZVNQ3deX-PkqXGyz0S_Bt5z492VMkjF0ATd1_PHHWaDzkzih8rFGQrOSPjJaKJexWC3FhkCNRCfYQUdaUarmMkPPkMLx2_z40MPKRxPZdP8nhDEjhMF8fw85as_9OLxFnNMpOzuONp_LLOp4BkiYFyZJYsqzJhd6simuVz9mwngbWc',
    category: '狗狗',
    isVaccinated: false,
    isNeutered: false,
    tags: ['温顺', '粘人'],
    description: '大白还是个宝宝，非常温顺，喜欢和人呆在一起。'
  },
  {
    id: '3',
    name: '巴迪 (Buddy)',
    breed: '金毛寻回犬',
    age: '2 岁',
    gender: '公',
    weight: '32kg',
    imageUrl: IMAGES.buddyDetail,
    category: '狗狗',
    isVaccinated: true,
    isNeutered: true,
    tags: ['对儿童友好', '已接种疫苗', '定点如厕训练'],
    description: '巴迪是一个充满快乐的小家伙，它最喜欢在阳光下睡午觉，或者玩捡球游戏直到你的胳膊累得动不了为止！'
  }
];
