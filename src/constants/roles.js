// Role definitions
const ROLES = {
    BE: 'BE', // Business Executive
    BM: 'BM', // Business Manager
    SBM: 'SBM', // Senior Business Manager
    ABM: 'ABM', // Area Business Manager
    RBM: 'RBM', // Regional Business Manager
    ZBM: 'ZBM', // Zonal Business Manager
    DGM: 'DGM', // Deputy General Manager
    ADMIN: 'ADMIN', // Administrator
    SUPER_ADMIN: 'SUPER_ADMIN' // Super Administrator
  };
  
  // Role hierarchy (lower index means higher privilege)
  const ROLE_HIERARCHY = [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DGM,
    ROLES.ZBM,
    ROLES.RBM,
    ROLES.ABM,
    ROLES.SBM,
    ROLES.BM,
    ROLES.BE
  ];
  
  // Role display names
  const ROLE_DISPLAY_NAMES = {
    [ROLES.BE]: 'Business Executive',
    [ROLES.BM]: 'Business Manager',
    [ROLES.SBM]: 'Senior Business Manager',
    [ROLES.ABM]: 'Area Business Manager',
    [ROLES.RBM]: 'Regional Business Manager',
    [ROLES.ZBM]: 'Zonal Business Manager',
    [ROLES.DGM]: 'Deputy General Manager',
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.SUPER_ADMIN]: 'Super Administrator'
  };
  
  // Role categories
  const ROLE_CATEGORIES = {
    LOWER_LEVEL: [ROLES.BE, ROLES.BM, ROLES.SBM],
    MID_LEVEL: [ROLES.ABM, ROLES.RBM],
    SENIOR_LEVEL: [ROLES.ZBM, ROLES.DGM],
    ADMIN_LEVEL: [ROLES.ADMIN, ROLES.SUPER_ADMIN]
  };
  
  // Check if a role has higher or equal privilege than another
  const hasHigherOrEqualPrivilege = (role1, role2) => {
    const role1Index = ROLE_HIERARCHY.indexOf(role1);
    const role2Index = ROLE_HIERARCHY.indexOf(role2);
    
    return role1Index <= role2Index;
  };
  
  export {
    ROLES,
    ROLE_HIERARCHY,
    ROLE_DISPLAY_NAMES,
    ROLE_CATEGORIES,
    hasHigherOrEqualPrivilege
  };