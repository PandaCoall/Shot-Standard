import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, l as Slot, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as SUBJECT_LABELS, n as SECTION_ORDER, r as SUBJECT_KINDS, s as parsePlate, t as DEFAULT_STANDARD } from "./parse-prompt-v60lJv_I.mjs";
import { a as string, i as object, t as _enum } from "../_libs/zod.mjs";
import { a as Pencil, c as History, d as Clapperboard, f as Check, i as RotateCcw, l as Download, o as LoaderCircle, r as SlidersHorizontal, s as ImagePlus, t as X, u as Copy } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DPlfb8CX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg shadow-border hover:bg-accent/90",
			outline: "bg-transparent text-fg shadow-border hover:bg-elevated hover:shadow-border-hover",
			ghost: "bg-transparent text-muted hover:bg-elevated hover:text-fg",
			mark: "bg-mark text-paper hover:bg-mark/90"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5 text-sm",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function AppHeader({ onHistory, onStandard, historyCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-4 px-4 py-4 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-2xl leading-none font-medium tracking-tight text-fg sm:text-3xl",
				children: ["Shot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-mark",
					children: "Standard"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs tracking-wide text-muted",
				children: "MiniMax prompt desk"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onHistory,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5" }),
					"History",
					historyCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-subtle",
						children: historyCount
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onStandard,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5" }), "Standard"]
			})]
		})]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border", "placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted", className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-lg bg-elevated px-3 py-2.5 text-sm text-fg shadow-border", "placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ControlsPanel({ subject, onSubject, character, onCharacter, dialogue, onDialogue, delivery, onDelivery, notes, onNotes, canGenerate, generating, onGenerate, stageLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: SUBJECT_KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSubject(kind),
						className: cn("h-9 rounded-full px-3 text-xs font-medium transition-[background-color,color,box-shadow] duration-150", subject === kind ? "bg-accent text-accent-fg" : "bg-elevated text-muted shadow-border hover:text-fg"),
						"aria-pressed": subject === kind,
						children: kind === "auto" ? "Auto" : `[${SUBJECT_LABELS[kind]}]`
					}, kind))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "character",
						children: "Character name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "character",
						placeholder: "Optional",
						value: character,
						onChange: (e) => onCharacter(e.target.value),
						maxLength: 80
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "delivery",
						children: "Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "delivery",
						placeholder: "quiet, tense, whispered",
						value: delivery,
						onChange: (e) => onDelivery(e.target.value),
						maxLength: 200
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "dialogue",
					children: "Exact dialogue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "dialogue",
					placeholder: "Leave blank to infer from the still",
					value: dialogue,
					onChange: (e) => onDialogue(e.target.value),
					maxLength: 400
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "notes",
					children: "Extra notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "notes",
					placeholder: "Phone-video look, keep the sign, no music…",
					value: notes,
					onChange: (e) => onNotes(e.target.value),
					maxLength: 800,
					className: "min-h-16"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "w-full",
				disabled: !canGenerate || generating,
				onClick: onGenerate,
				children: generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), stageLabel ?? "Writing the plate"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Write prompt"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-subtle",
				children: "⌘ / Ctrl + Enter"
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-surface p-5 text-fg shadow-border", "data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out", "max-h-[88dvh] overflow-hidden", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function HistoryDialog({ open, onOpenChange, items, onRestore, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "flex max-h-[88dvh] flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "History" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Recent plates stay on this device." })] }),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-sm text-muted",
					children: "No plates yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onRestore(item);
							onOpenChange(false);
						},
						className: "flex w-full items-center gap-3 rounded-lg bg-elevated p-2 text-left shadow-border transition-[box-shadow] hover:shadow-border-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.thumbnail,
							alt: "",
							className: "still-outline size-14 shrink-0 rounded-md object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-mono text-xs text-fg",
								children: item.dialogue || item.subject || "Untitled plate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-subtle",
								children: new Date(item.createdAt).toLocaleString()
							})]
						})]
					}) }, item.id))
				}),
				items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClear,
						children: "Clear history"
					})
				}) : null
			]
		})
	});
}
async function copyText(value, label) {
	try {
		await navigator.clipboard.writeText(value);
		toast.success(label);
	} catch {
		toast.error("Clipboard is blocked");
	}
}
function downloadPlate(value) {
	const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `shot-standard-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.txt`;
	a.click();
	URL.revokeObjectURL(url);
}
function PlateView({ prompt, generating, error, onChange }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const parsed = (0, import_react.useMemo)(() => parsePlate(prompt), [prompt]);
	const handleCopy = async () => {
		await copyText(prompt, "Plate copied");
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col rounded-xl bg-surface shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Plate"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg font-medium tracking-tight text-fg",
				children: "MiniMax prompt"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: !prompt,
						onClick: () => setEditing((v) => !v),
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Preview"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Edit"] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: !prompt,
						onClick: () => downloadPlate(prompt),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), ".txt"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: !prompt,
						onClick: handleCopy,
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy plate"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5",
			children: generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WritingState, {}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-elevated px-4 py-3 text-sm text-mark shadow-border",
				children: error
			}) : !prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyPlate, {}) : editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: prompt,
				onChange: (e) => onChange(e.target.value),
				className: "min-h-96 font-mono text-plate leading-relaxed"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateBody, {
				sections: parsed.sections,
				fallback: prompt
			})
		})]
	});
}
function EmptyPlate() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-72 flex-col justify-center gap-6 px-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-medium tracking-tight text-fg",
			children: "The plate is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-sm text-sm text-muted",
			children: "Drop a still and write a prompt. Grok will fill every marker in the MiniMax standard."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3",
			children: SECTION_ORDER.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline gap-2 font-mono text-micro tracking-wide text-subtle uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle/70 tabular-nums",
					children: String(i + 1).padStart(2, "0")
				}), name]
			}, name))
		})]
	});
}
function WritingState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "shimmer-text font-display text-xl font-medium tracking-tight",
			children: "Reading the still, writing the plate"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-3",
			children: SECTION_ORDER.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-micro tracking-wide text-subtle uppercase",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2.5 rounded-sm bg-elevated",
					style: { width: `${58 + i * 17 % 32}%` }
				})]
			}, name))
		})]
	});
}
function PlateBody({ sections, fallback }) {
	if (sections.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "whitespace-pre-wrap font-mono text-plate leading-relaxed text-fg",
		children: fallback
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-6",
		children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-mono text-micro tracking-widest text-mark uppercase",
					children: section.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("inline-flex size-8 items-center justify-center rounded-md text-subtle", "transition-colors hover:bg-elevated hover:text-fg"),
					onClick: () => copyText(`${section.name}:\n${section.body}`, `${section.name} copied`),
					"aria-label": `Copy ${section.name}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap font-mono text-[0.8125rem] leading-relaxed text-fg",
				children: section.body
			})]
		}, section.name))
	});
}
function StandardDialog({ open, onOpenChange, value, onChange, onReset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "flex max-h-[88dvh] max-w-3xl flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Prompt standard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Grok follows this template for every still. Edit the markers, keep the section names." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value,
					onChange: (e) => onChange(e.target.value),
					className: "min-h-0 flex-1 font-mono text-plate leading-relaxed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							onChange(DEFAULT_STANDARD);
							onReset();
						},
						children: "Restore default"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => onOpenChange(false),
						children: "Save standard"
					})]
				})
			]
		})
	});
}
function StillStage({ imageDataUrl, onFile, onExample, busy }) {
	const inputRef = (0, import_react.useRef)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const take = (list) => {
		const file = list?.[0];
		if (file) onFile(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "Still"
				}), imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted transition-colors hover:text-fg",
					onClick: () => inputRef.current?.click(),
					children: "Replace"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
				className: "sr-only",
				tabIndex: -1,
				"aria-hidden": "true",
				onChange: (e) => {
					take(e.target.files);
					e.currentTarget.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => inputRef.current?.click(),
				onDragOver: (e) => {
					e.preventDefault();
					setDragOver(true);
				},
				onDragLeave: () => setDragOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragOver(false);
					take(e.dataTransfer.files);
				},
				className: cn("group relative flex min-h-56 w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-surface p-2 text-left shadow-border transition-[box-shadow] duration-150", dragOver && "shadow-border-hover", !imageDataUrl && "min-h-64"),
				children: imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: imageDataUrl,
					alt: "Uploaded still",
					className: "still-outline max-h-72 w-full rounded-lg object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col items-center gap-4 px-6 py-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-12 items-center justify-center rounded-md bg-elevated text-muted shadow-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-medium tracking-tight text-fg",
							children: "Drop a still"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Click, paste, or drag a JPEG / PNG"
						})]
					})]
				})
			}),
			!imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Clipboard paste works too"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onExample,
					disabled: busy,
					className: "text-xs font-medium text-accent transition-colors hover:text-fg disabled:opacity-40",
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), "Loading"]
					}) : "Load example still"
				})]
			}) : null
		]
	});
}
var MAX_EDGE = 1600;
var MAX_CHARS = 14e5;
var ACCEPT = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg"
]);
function isSupportedStill(file) {
	if (ACCEPT.has(file.type)) return true;
	const name = file.name.toLowerCase();
	return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");
}
async function stillToDataUrl(file) {
	if (file.size > 18874368) throw new Error("That still is too large. Use a JPEG or PNG under 15 MB.");
	if (!isSupportedStill(file)) throw new Error("Use a JPEG, PNG, or WebP still.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("Could not read that still.");
	}
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	let quality = .86;
	let url = canvas.toDataURL("image/jpeg", quality);
	while (url.length > MAX_CHARS && quality > .48) {
		quality -= .08;
		url = canvas.toDataURL("image/jpeg", quality);
	}
	if (url.length > MAX_CHARS) throw new Error("Could not compress that still enough. Try a simpler image.");
	return url;
}
async function stillToThumb(dataUrl, size = 160) {
	const img = await loadImage(dataUrl);
	const scale = size / Math.max(img.width, img.height);
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(img.width * scale));
	canvas.height = Math.max(1, Math.round(img.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) return dataUrl;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL("image/jpeg", .62);
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that still."));
		img.src = src;
	});
}
async function fetchExampleStill() {
	const res = await fetch("/example-still.png");
	if (!res.ok) throw new Error("Example still is missing.");
	const blob = await res.blob();
	return stillToDataUrl(new File([blob], "example-still.png", { type: blob.type || "image/png" }));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var InputSchema = object({
	imageDataUrl: string().min(32).max(2e6),
	subject: _enum(SUBJECT_KINDS),
	character: string().max(80).optional(),
	dialogue: string().max(400).optional(),
	delivery: string().max(200).optional(),
	notes: string().max(800).optional(),
	standard: string().max(12e3).optional()
});
var generatePrompt = createServerFn({ method: "POST" }).validator((input) => InputSchema.parse(input)).handler(createSsrRpc("ae0b66bc00cda576a80e03abb5ceaab9ac189b8280d56d030ca6f8306bf252f0"));
var KEY = "shot-standard-history-v1";
var STANDARD_KEY = "shot-standard-template-v1";
var MAX_ITEMS = 24;
function safeParse(raw, fallback) {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function loadHistory() {
	if (typeof window === "undefined") return [];
	const items = safeParse(localStorage.getItem(KEY), []);
	return Array.isArray(items) ? items.slice(0, MAX_ITEMS) : [];
}
function persistHistory(items) {
	localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}
function loadStandard() {
	if (typeof window === "undefined") return null;
	const value = localStorage.getItem(STANDARD_KEY);
	return value && value.trim() ? value : null;
}
function persistStandard(value) {
	localStorage.setItem(STANDARD_KEY, value);
}
function newId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
var STAGES = [
	"Reading the still",
	"Locking subject",
	"Writing the plate"
];
function ShotDesk() {
	const [imageDataUrl, setImageDataUrl] = (0, import_react.useState)(null);
	const [subject, setSubject] = (0, import_react.useState)("auto");
	const [character, setCharacter] = (0, import_react.useState)("");
	const [dialogue, setDialogue] = (0, import_react.useState)("");
	const [delivery, setDelivery] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [stageLabel, setStageLabel] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [exampleBusy, setExampleBusy] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [standardOpen, setStandardOpen] = (0, import_react.useState)(false);
	const [standard, setStandard] = (0, import_react.useState)(DEFAULT_STANDARD);
	const generatingRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		setHistory(loadHistory());
		setStandard(loadStandard() ?? DEFAULT_STANDARD);
	}, []);
	const applyStill = (0, import_react.useCallback)((dataUrl) => {
		setImageDataUrl(dataUrl);
		setPrompt("");
		setError(null);
	}, []);
	const handleFile = (0, import_react.useCallback)(async (file) => {
		try {
			const dataUrl = await stillToDataUrl(file);
			applyStill(dataUrl);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not read that still.";
			toast.error(message);
		}
	}, [applyStill]);
	const handleExample = (0, import_react.useCallback)(async () => {
		setExampleBusy(true);
		try {
			const dataUrl = await fetchExampleStill();
			applyStill(dataUrl);
			setSubject("man");
			setDialogue("Just to sell.");
			setDelivery("Energetic, slightly exaggerated, direct to camera");
			setNotes("Keep the dilapidated house, rusty SOLD FOR SALE sign, black zip-up jacket, and phone-camera aesthetic. Preserve the JUST TO SELL overlay style.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not load the example.";
			toast.error(message);
		} finally {
			setExampleBusy(false);
		}
	}, [applyStill]);
	const writePlate = (0, import_react.useCallback)(async () => {
		if (!imageDataUrl || generatingRef.current) return;
		generatingRef.current = true;
		setGenerating(true);
		setError(null);
		setStageLabel(STAGES[0]);
		const stageTimer = window.setInterval(() => {
			setStageLabel((current) => {
				const i = STAGES.indexOf(current ?? STAGES[0]);
				return STAGES[Math.min(i + 1, STAGES.length - 1)] ?? STAGES[2];
			});
		}, 2200);
		try {
			const result = await generatePrompt({ data: {
				imageDataUrl,
				subject,
				character: character.trim() || void 0,
				dialogue: dialogue.trim() || void 0,
				delivery: delivery.trim() || void 0,
				notes: notes.trim() || void 0,
				standard
			} });
			if (!result.ok) {
				setError(result.error);
				toast.error(result.error);
				return;
			}
			setPrompt(result.prompt);
			const thumbnail = await stillToThumb(imageDataUrl);
			const item = {
				id: newId(),
				createdAt: Date.now(),
				thumbnail,
				prompt: result.prompt,
				subject,
				dialogue: dialogue.trim()
			};
			setHistory((prev) => {
				const next = [item, ...prev].slice(0, 24);
				persistHistory(next);
				return next;
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not write the plate.";
			setError(message);
			toast.error(message);
		} finally {
			window.clearInterval(stageTimer);
			setStageLabel(null);
			setGenerating(false);
			generatingRef.current = false;
		}
	}, [
		imageDataUrl,
		subject,
		character,
		dialogue,
		delivery,
		notes,
		standard
	]);
	(0, import_react.useEffect)(() => {
		const onPaste = (event) => {
			const items = event.clipboardData?.items;
			if (!items) return;
			for (const item of items) if (item.type.startsWith("image/")) {
				const file = item.getAsFile();
				if (file) {
					event.preventDefault();
					handleFile(file);
				}
				return;
			}
		};
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
	}, [handleFile]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
				event.preventDefault();
				writePlate();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [writePlate]);
	const restore = (item) => {
		setPrompt(item.prompt);
		setDialogue(item.dialogue);
		if (item.subject === "auto" || item.subject === "man" || item.subject === "woman" || item.subject === "child" || item.subject === "officer") setSubject(item.subject);
		toast.success("Plate restored");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {
				onHistory: () => setHistoryOpen(true),
				onStandard: () => setStandardOpen(true),
				historyCount: history.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-12 lg:gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5 animate-rise lg:col-span-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StillStage, {
						imageDataUrl,
						onFile: (file) => void handleFile(file),
						onExample: () => void handleExample(),
						busy: exampleBusy
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsPanel, {
						subject,
						onSubject: setSubject,
						character,
						onCharacter: setCharacter,
						dialogue,
						onDialogue: setDialogue,
						delivery,
						onDelivery: setDelivery,
						notes,
						onNotes: setNotes,
						canGenerate: Boolean(imageDataUrl),
						generating,
						onGenerate: () => void writePlate(),
						stageLabel
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-96 animate-rise stagger-2 lg:col-span-8 lg:min-h-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateView, {
						prompt,
						generating,
						error,
						onChange: setPrompt
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryDialog, {
				open: historyOpen,
				onOpenChange: setHistoryOpen,
				items: history,
				onRestore: restore,
				onClear: () => {
					persistHistory([]);
					setHistory([]);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandardDialog, {
				open: standardOpen,
				onOpenChange: setStandardOpen,
				value: standard,
				onChange: (value) => {
					setStandard(value);
					persistStandard(value);
				},
				onReset: () => persistStandard(DEFAULT_STANDARD)
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShotDesk, {});
}
//#endregion
export { Home as component };
