export const passwordRule = (node: FormKitNode) =>
{
    return isPasswordValid(node.value as string);
};
