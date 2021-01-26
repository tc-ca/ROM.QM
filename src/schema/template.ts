export interface Template {
    /**
     * unique id (GUID) of the template
     * @TJS-type string
     */
    templateid: string;

    /**
     * name of the template
     * @TJS-type string
     */
    name: string;

    title: Title;

    groups: Group[];

    /** @nullable */
    searchableProvisions: SearchableProvision[];

    readOnly: boolean;
}

export interface Group {
    primaryKey: string;
    title: Title;
    isRepeatable: boolean;
    isVisible: boolean;
    order: number;
    questions: Question[];
    domSuffix: string;
    htmlElementId: string;
    expansionPanels: number[]; // shouldnt be here
}

export interface Question {
    name: string;
    id: number;
    guid: string;
    sortOrder: number;
    isVisible: boolean;
    isMultiple: boolean;
    text: Title;
    type: QuestionResponseType;
    response: string[] | number | null | string;
    isSamplingAllowed?: boolean;

    /** @nullable */
    samplingRecord?: SamplingRecord | null;

    isRepeatable?: boolean;
    isRepeated?: boolean;

    /** @nullable */
    // only radio and select have resonse options...currently - TODO: every type of Question should have them
    responseOptions: QuestionResponseOption[];

    validationRules: ValidationRule[];
    violationInfo: ViolationInfo;
    childQuestions: Question[];
    /**
    * @default []
    */
    dependants: Dependent[];
    dependencyGroups: DependencyGroup[];
    validationState: boolean;
    notification?: Notification;
}

export interface Dependent {
    guid: string;
}

export interface DependencyGroup {
    ruleType: DependencyGroupType;
    childValidatorName: null;
    questionDependencies: QuestionDependency[];
}

export interface QuestionDependency {
    dependsOnQuestion: QuestionDependencyItem;

    /** @nullable */
    validationAction: ComparisonOperator | null;
    validationValue: string;
}

export interface Notification {
    guid?: string;
    header: string;
    text: string;
    icon?: Icon;
    color: Color;
    groupIndex?: number;
    questionId?: number;
    qguid?: string;
    depth?: number;
    timeout?: number;
    showing?: boolean;
}

export enum Color {
    Error = "error",
}

export enum Icon {
    MDIMessageAlert = "mdi-message-alert",
    MDIMessageDraw = "mdi-message-draw",
}

export interface QuestionDependencyItem {
    guid: string;
}

export interface Comment {
    option: Option;
    value: string;
}

export interface QuestionResponseOption {
    id: number;
    sortOrder: number;
    text: Title;
    value: string;
    internalComment: Comment;
    externalComment: Comment;
    picture: Picture;
    provisions: string[];
    selectedProvisions: any[];

    /** @nullable */
    searchProvisions: string | null;
    isProvisionCollapsed: boolean;
    name: string;
    selectedProvisionsTitles?: any[];
}

export interface Picture {
    option: Option;
    value: PictureItems[];
    validationStatus?: boolean;
    notification?: null;
}

export interface PictureItems {
    base64String: string;
    title: string;
    comment: string;
    timeStamp: Date;
}

export interface Title {
    en: string;
    fr: string;
}

export interface ValidationRule {
    name: ValidationRuleType;
    enabled: boolean;
    type: ValidationRuleType;

    /** @nullable */
    value: ValidationValue;
    errorMessage: Title;
}

export type ValidationValue = string | number | null;

export interface ViolationInfo {
    responseToMatch: string;
    matchingType: ComparisonOperator;
    referenceID: string | null;
}
export interface SamplingRecord {
    approximateTotal: string;
    sampleSize: string;
    nonCompliances: string;
}

export interface SearchableProvision {
    leg: string;
    questions: string[];
}

export enum QuestionResponseType {
    Reference = "reference",
    Image = "image",
    Number = "number",
    Select = "select",
    Radio = "radio",
    Text = "text",
}

export enum ComparisonOperator {
    Equal = "equal",
    NotEqual = "notEqual",
    GreaterThen = "greaterThen",
    LessThen = "lessThen",
    LengthLessThen = "lengthLessThen",
    LengthGreaterThen = "lengthGreaterThen",
}

export enum ValidationRuleType {
    Require = "require",
    Min = "min",
    Max = "max",
    MinLength = "minLength",
    MaxLength = "maxLength",
}

export enum Option {
    Optional = "optional",
    Required = "required",
    NA = "n/a"
}

export enum DependencyGroupType {
    Visibility = "visibility",
    Validation = "validation",
    ValidationValue = "validationValue"
}