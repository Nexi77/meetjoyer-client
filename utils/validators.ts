export const passwordRule = (node: FormKitNode) =>
{
    return isPasswordValid(node.value as string);
};

export const endDateGreaterThanStart = (node: FormKitNode) =>
{
    const endDate = node.value as string;
    const startDate = node.at('startDate')?.value as string;

    if (startDate && endDate)
    {
        return new Date(endDate) > new Date(startDate);
    }

    return true;
};
