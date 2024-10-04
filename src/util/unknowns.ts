export function Unknown(value: unknown): unknown {
    return value;
}
export function UnknownType(target: Object, propertyKey: string | symbol) {
    Reflect.metadata('design:type', Unknown)(target, propertyKey);
}

export function UnknownProperty(value: unknown): unknown {
    return value;
}
export function UnknownPropertyType(target: Object, propertyKey: string | symbol) {
    Reflect.metadata('design:type', UnknownProperty)(target, propertyKey);
}

export function UnknownProperties(properties: { [k: string]: unknown }): {
    [k: string]: unknown;
} {
    return properties;
}
export function UnknownPropertiesType(target: Object, propertyKey: string | symbol) {
    Reflect.metadata('design:type', UnknownProperties)(target, propertyKey);
}